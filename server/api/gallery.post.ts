import { z } from "zod";
import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env"
  );
}

if (!process.env.MONGODB_DB) {
  throw new Error(
    "Please define the MONGODB_DB environment variable inside .env"
  );
}

if (!process.env.DATABASE_KEY) {
  throw new Error(
    "Please define the DATABASE_KEY environment variable inside .env"
  );
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

// Create a new MongoClient
const client = new MongoClient(uri);

export default defineEventHandler(async (event) => {
  const bodySchema = z
    .object({
      dbKey: z.string().min(32).max(32),
      extension: z.string(),
      imageAuthor: z.string(),
      imageId: z.string(),
      prompt: z.string(),
    })
    .strict();

  const body = await readBody(event);

  // Check if the body is present
  if (!body) {
    throw createError({
      message: "Missing required fields",
      statusCode: 400,
    });
  }

  // Check if the body is valid
  const parsedBody = bodySchema.safeParse(body);

  if (!parsedBody.success) {
    console.log(parsedBody.error);

    throw createError({
      message: "The provided parameters are invalid",
      statusCode: 400,
    });
  }

  const { dbKey, extension, imageAuthor, imageId, prompt } = parsedBody.data;

  if (dbKey !== process.env.DATABASE_KEY) {
    throw createError({
      message: "The provided database key is invalid",
      statusCode: 401,
    });
  }

  const data = {
    extension,
    imageAuthor,
    imageId,
    prompt,
    timestamp: Math.floor(Date.now() / 1000),
  };

  try {
    await client.connect();

    const database = client.db(dbName);
    const collection = database.collection("AIGallery");

    const result = await collection.insertOne(data);

    setResponseStatus(event, 201);
    return {
      message: "Successfully inserted the image into the database",
      result,
    };
  } catch (error) {
    console.log(error);

    throw createError({
      message: "An error occurred while inserting the image into the database",
      statusCode: 500,
    });
  }
});
