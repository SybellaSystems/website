import getClientPromise from "../mongodb";
import { ObjectId, WithId, ModifyResult, Collection } from "mongodb";
import { Project } from "@/types";
import { projectSchema } from "@/app/schemas/project.schema";

export interface ProjectDocument extends Omit<Project, "id"> {
  _id: ObjectId;
}

function mapProject(doc: ProjectDocument | WithId<ProjectDocument>): Project {
  return {
    id: doc._id.toString(),
    title: doc.title,
    overview: doc.overview,
    image: doc.image,
    problemSolved: doc.problemSolved,
    techStack: doc.techStack,
    partners: doc.partners,
    callToAction: doc.callToAction,
    isActive: doc.isActive,
    demoLink: doc.demoLink,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function createProject(data: Project): Promise<Project> {
  const parsed = projectSchema.parse(data);
  const client = await getClientPromise();
  const db = client.db();
  const projects: Collection<ProjectDocument> = db.collection("projects");

  const now = new Date();
  const res = await projects.insertOne({
    ...parsed,
    createdAt: now,
    updatedAt: now,
  } as ProjectDocument);

  return { ...parsed, id: res.insertedId.toString() };
}

export async function getAllProjects(): Promise<Project[]> {
  const client = await getClientPromise();
  const db = client.db();
  const projects: Collection<ProjectDocument> = db.collection("projects");
  const docs = await projects.find({}).sort({ createdAt: -1 }).toArray();
  return docs.map(mapProject);
}

export async function getProjectById(id: string): Promise<Project | null> {
  const client = await getClientPromise();
  const db = client.db();
  const projects: Collection<ProjectDocument> = db.collection("projects");
  const doc = await projects.findOne({ _id: new ObjectId(id) });
  return doc ? mapProject(doc) : null;
}


export async function updateProject(
  id: string,
  data: Partial<Project>
): Promise<Project | null> {
  const client = await getClientPromise();
  const db = client.db();
  const projects: Collection<ProjectDocument> = db.collection("projects");

  const res = await projects.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...data, updatedAt: new Date() } },
    { returnDocument: "after" }
  )

  if (!res) return null;
  return mapProject(res);
  
}




export async function deleteProject(id: string): Promise<boolean> {
  const client = await getClientPromise();
  const db = client.db();
  const projects: Collection<ProjectDocument> = db.collection("projects");
  const res = await projects.deleteOne({ _id: new ObjectId(id) });
  return !!res.deletedCount && res.deletedCount > 0;
}
