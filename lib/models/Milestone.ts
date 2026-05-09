import getClientPromise from "../mongodb";
import { ObjectId } from "mongodb";

export interface Milestone {
  _id?: ObjectId;
  name: string;
  description: string;
  startYear: number;
  endYear: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Add  new milestone
export async function addMilestone(milestone: Milestone) {
  const client = await getClientPromise();
  const db = client.db();
  const collection = db.collection<Milestone>("milestones");

  const now = new Date();
  const res = await collection.insertOne({ ...milestone, createdAt: now, updatedAt: now });
  return { success: true, milestoneId: res.insertedId };
}

// Get all milestones
export async function getAllMilestones() {
  const client = await getClientPromise();
  const db = client.db();
  const collection = db.collection<Milestone>("milestones");

  const milestones = await collection.find({}).sort({ startYear: 1 }).toArray();
  return milestones;
}

// Get  single milestone by ID
export async function getMilestoneById(id: string) {
  const client = await getClientPromise();
  const db = client.db();
  const collection = db.collection<Milestone>("milestones");

  const milestone = await collection.findOne({ _id: new ObjectId(id) });
  return milestone;
}

// Update  milestone
export async function updateMilestone(id: string, data: Partial<Milestone>) {
  const client = await getClientPromise();
  const db = client.db();
  const collection = db.collection<Milestone>("milestones");

  const now = new Date();
  const res = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { ...data, updatedAt: now } });
  return res.modifiedCount > 0;
}

// Delete  milestone
export async function deleteMilestone(id: string) {
  const client = await getClientPromise();
  const db = client.db();
  const collection = db.collection<Milestone>("milestones");

  const res = await collection.deleteOne({ _id: new ObjectId(id) });
  return res.deletedCount > 0;
}
