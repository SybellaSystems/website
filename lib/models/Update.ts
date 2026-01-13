import getClientPromise from "../mongodb";
import { ObjectId, WithId, Collection } from "mongodb";
import { z } from "zod";

// Schema validation using Zod
export const updateSchema = z.object({
  title: z.string().min(3, "Title is required"),
  category: z.enum(["news", "announcement", "event", "other"]),
  description: z.string().min(5, "Description is required"),
  thumbnail: z.string().url().optional(),
  author: z.string().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Type inferred from schema
export type Update = z.infer<typeof updateSchema> & { id?: string };

// MongoDB document interface
export interface UpdateDocument extends Omit<Update, "id"> {
  _id: ObjectId;
}

// Map MongoDB document → frontend model
function mapUpdate(doc: WithId<UpdateDocument>): Update {
  return {
    id: doc._id.toString(),
    title: doc.title,
    category: doc.category,
    description: doc.description,
    author: doc.author,
    thumbnail: doc.thumbnail,
    isActive: doc.isActive,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

// ✅ Create Update
export async function createUpdate(data: Update): Promise<Update> {
  const parsed = updateSchema.parse(data);
  const client = await getClientPromise();
  const db = client.db();
  const updates: Collection<UpdateDocument> = db.collection("updates");

  const now = new Date();
  const res = await updates.insertOne({
    ...parsed,
    createdAt: now,
    updatedAt: now,
  } as UpdateDocument);

  return { ...parsed, id: res.insertedId.toString() };
}

// ✅ Get All Updates
export async function getAllUpdates(): Promise<Update[]> {
  const client = await getClientPromise();
  const db = client.db();
  const updates: Collection<UpdateDocument> = db.collection("updates");

  const docs = await updates.find({}).sort({ createdAt: -1 }).toArray();
  return docs.map(mapUpdate);
}

// ✅ Get Single Update by ID
export async function getUpdateById(id: string): Promise<Update | null> {
  const client = await getClientPromise();
  const db = client.db();
  const updates: Collection<UpdateDocument> = db.collection("updates");

  const doc = await updates.findOne({ _id: new ObjectId(id) });
  return doc ? mapUpdate(doc) : null;
}

// ✅ Update an Update
export async function updateUpdate(
  id: string,
  data: Partial<Update>
): Promise<Update | null> {
  const client = await getClientPromise();
  const db = client.db();
  const updates: Collection<UpdateDocument> = db.collection("updates");

  const updated = await updates.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...data, updatedAt: new Date() } },
    { returnDocument: "after" }
  );

  if (!updated) return null;
  return mapUpdate(updated);
}

// ✅ Delete an Update
export async function deleteUpdate(id: string): Promise<boolean> {
  const client = await getClientPromise();
  const db = client.db();
  const updates: Collection<UpdateDocument> = db.collection("updates");

  const res = await updates.deleteOne({ _id: new ObjectId(id) });
  return !!res.deletedCount && res.deletedCount > 0;
}
