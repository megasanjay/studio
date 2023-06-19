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

export default defineEventHandler(async (_event) => {
  try {
    await client.connect();

    const database = client.db(dbName);
    const collection = database.collection("heartbeats");

    const data = {
      timestamp: Date.now() / 1000,
    };

    await collection.insertOne(data);

    // delete the oldest heartbeat
    const heartbeatCount = await collection.countDocuments();

    if (heartbeatCount > 20) {
      const oldestHeartbeat = await collection.findOne(
        {},
        { sort: { timestamp: 1 } }
      );

      if (oldestHeartbeat) {
        await collection.deleteOne({ _id: oldestHeartbeat._id });
      }
    }

    return {
      message: "thump thump",
    };
  } catch (error) {
    console.log(error);

    throw createError({
      message: "An error occurred while processing the request",
      statusCode: 500,
    });
  }
});
