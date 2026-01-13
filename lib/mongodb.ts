// lib/mongodb.ts
import { MongoClient, MongoClientOptions } from "mongodb";

// MongoDB connection options with SSL/TLS support
const options: MongoClientOptions = {
  // Ensure SSL/TLS is properly configured
  tls: true,
  tlsAllowInvalidCertificates: false,
  // Connection pool settings
  maxPoolSize: 10,
  minPoolSize: 1,
  // Timeout settings
  connectTimeoutMS: 30000,
  serverSelectionTimeoutMS: 30000,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

function getClientPromise(): Promise<MongoClient> {
  // Prevent MongoDB connections during build time
  // Check multiple ways Next.js might indicate build time
  const isBuildTime = 
    process.env.NEXT_PHASE === 'phase-production-build' ||
    process.env.NEXT_PHASE === 'phase-production-compile' ||
    (typeof process.env.NEXT_RUNTIME === 'undefined' && process.env.NODE_ENV === 'production' && !process.env.VERCEL);

  if (isBuildTime) {
    // Return a rejected promise that can be caught gracefully
    return Promise.reject(new Error("MongoDB connections are not available during build time"));
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("Please add your Mongo URI to .env");
  }

  if (process.env.NODE_ENV === "development") {
    // Avoid multiple connections in dev
    if (!(global as any)._mongoClientPromise) {
      client = new MongoClient(process.env.MONGODB_URI, options);
      (global as any)._mongoClientPromise = client.connect();
    }
    return (global as any)._mongoClientPromise;
  } else {
    // In production, reuse connection if available
    if (!(global as any)._mongoClientPromise) {
      client = new MongoClient(process.env.MONGODB_URI, options);
      (global as any)._mongoClientPromise = client.connect();
    }
    return (global as any)._mongoClientPromise;
  }
}

export default getClientPromise;
