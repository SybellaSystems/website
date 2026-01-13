import getClientPromise from "../mongodb";
import {ObjectId} from 'mongodb';
export interface TeamMember {
  _id?: string;
  name: string;
  role: string;
  image: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  createdAt?: Date;
  updatedAt?: Date;
}


export async function createTeamMember(data: Omit<TeamMember, "_id">) {
  const client = await getClientPromise();
  const db = client.db();
  const res = await db.collection("team_members").insertOne({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return res.insertedId;
}


export async function getAllTeamMembers() {
  const client = await getClientPromise();
  const db = client.db();
  const members = await db
    .collection("team_members")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
  return members;
}


export async function getTeamMemberById(id: string) {
  const client = await getClientPromise();
  const db = client.db();
  const member = await db.collection("team_members").findOne({ _id: new ObjectId(id) });
  return member;
}


export async function updateTeamMember(id: string, updates: Partial<TeamMember>) {
  const client = await getClientPromise();
  const db = client.db();
  const res = await db.collection("team_members").updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...updates, updatedAt: new Date() } }
  );
  return res.modifiedCount > 0;
}


export async function deleteTeamMember(id: string) {
  const client = await getClientPromise();
  const db = client.db();
  const res = await db.collection("team_members").deleteOne({ _id: new ObjectId(id) });
  return res.deletedCount > 0;
}
