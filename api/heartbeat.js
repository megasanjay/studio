/* eslint-disable no-undef */
import dayjs from "dayjs";
import sanitize from "mongo-sanitize";
import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env");
}

if (!process.env.MONGODB_DB) {
  throw new Error("Please define the MONGODB_DB environment variable inside .env");
}

if (!process.env.DATABASE_KEY) {
  throw new Error("Please define the DATABASE_KEY environment variable inside .env");
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

const client = new MongoClient(uri);

const heartbeat = async (request, response) => {
  // Create a new MongoClient

  if (request.method === "POST") {
    if ("body" in request) {
      const sanitizedBody = sanitize(request.body);

      const { dbKey } = sanitizedBody;

      if (dbKey !== process.env.DATABASE_KEY) {
        response.status(401).json({ error: "Unauthorized" });
        return;
      }

      try {
        await client.connect();

        // const database = client.db(dbName);
        // const collection = database.collection("heartbeats");

        const data = {
          timestamp: dayjs().unix(),
        };

        // const result = await collection.insertOne(data);

        // delete the oldest heartbeat
        // const heartbeatCount = await collection.countDocuments();

        // if (heartbeatCount > 20) {
        //   const oldestHeartbeat = await collection.findOne({}, { sort: { timestamp: 1 } });

        //   await collection.deleteOne({ _id: oldestHeartbeat._id });
        // }

        response.status(201).json({ data });
      } catch (error) {
        response.status(500).json({ error: error });
      }

      await client.close();

      return;
    }
  } else {
    response.status(405).json({ error: "Method not allowed" });
    return;
  }
};

// const heartbeat = allowCors(handler);

export default heartbeat;
