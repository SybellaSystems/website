import { NextResponse } from "next/server";
import {
  createProject,
  getAllProjects,
} from "@/lib/models/Project";

export async function GET() {
  const projects = await getAllProjects();
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newProject = await createProject(body);
  return NextResponse.json(newProject, { status: 201 });
}
