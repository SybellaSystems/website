import { NextResponse } from "next/server";
import { getUpdateById, updateUpdate, deleteUpdate } from "@/lib/models/Update";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const update = await getUpdateById(params.id);
    if (!update) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(update);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const updated = await updateUpdate(params.id, body);
    if (!updated) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const deleted = await deleteUpdate(params.id);
    if (!deleted) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
