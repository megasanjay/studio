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

// Create a new MongoClient
const client = new MongoClient(uri);

const allowCors = (fn) => async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

const handler = async (request, response) => {
  // console.log(request.method);

  // if (request.method === "POST") {
  if ("body" in request) {
    const sanitizedBody = sanitize(request.body);

    const { dbKey } = sanitizedBody;

    if (dbKey !== process.env.DATABASE_KEY) {
      response.status(401).json({ error: "Unauthorized" });
      return;
    }

    try {
      await client.connect();

      const database = client.db(dbName);
      const collection = database.collection("heartbeats");

      const result = await collection.insertOne({
        timestamp: dayjs().unix(),
      });

      // delete the oldest heartbeat

      const heartbeatCount = await collection.countDocuments();

      if (heartbeatCount > 20) {
        const oldestHeartbeat = await collection.findOne({}, { sort: { timestamp: 1 } });

        await collection.deleteOne({ _id: oldestHeartbeat._id });
      }

      response.status(201).json({ result: result });
    } catch (error) {
      response.status(500).json({ error: error });
    }

    return;
  } else {
    response.status(400).json({ error: "Bad request" });
  }
  // } else {
  //   response.status(405).json({ error: "Method not allowed" });
  //   return;
  // }
};

const heartbeat = allowCors(handler);

export default heartbeat;
