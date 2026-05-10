// lib/mongodb.ts
import { MongoClient } from "mongodb";

const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

function getClientPromise(): Promise<MongoClient> {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URL;

  if (!mongoUri) {
    throw new Error("Please add your Mongo URI to .env.local (MONGODB_URI)");
  }

  if (process.env.NODE_ENV === "development") {
    // Avoid multiple connections in dev
    if (!(global as any)._mongoClientPromise) {
      client = new MongoClient(mongoUri, options);
      (global as any)._mongoClientPromise = client.connect();
    }
    return (global as any)._mongoClientPromise;
  } else {
    client = new MongoClient(mongoUri, options);
    return client.connect();
    
  }
}

export default getClientPromise;
