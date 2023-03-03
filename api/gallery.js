import dayjs from "dayjs";
import sanitize from "mongo-sanitize";
import { MongoClient } from "mongodb";

// eslint-disable-next-line no-undef
const uri = process.env.MONGODB_URI;

// Create a new MongoClient
const client = new MongoClient(uri);

const gallery = async (request, response) => {
  if (request.method === "POST") {
    if ("body" in request) {
      const sanitizedBody = sanitize(request.body);

      const now = dayjs().unix();

      const data = {
        extension: sanitizedBody.extension,
        imageAuthor: sanitizedBody.imageAuthor,
        imageId: sanitizedBody.imageId,
        prompt: sanitizedBody.prompt,
        timestamp: now,
      };

      console.log(data);

      try {
        await client.connect();

        const database = client.db("sasoStudio_grabbeddo");
        const collection = database.collection("AIGallery");

        const result = await collection.insertOne(data);

        response.status(201).json({ result: result });
      } catch (error) {
        response.status(500).json({ error: error });
      }

      return;
    }
  } else {
    response.status(405).json({ error: "Method not allowed" });
    return;
  }
};

export default gallery;
