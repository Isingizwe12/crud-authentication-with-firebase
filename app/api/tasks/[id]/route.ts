// app/api/tasks/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";

// PATCH to edit task or toggle completed
export async function PATCH(
  req: NextRequest, 
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ Await context.params
    const data = await req.json();

    if (!id) {
      return NextResponse.json({ message: "Task id missing" }, { status: 400 });
    }

    const taskRef = doc(db, "tasks", id);
    await updateDoc(taskRef, data);

    return NextResponse.json({ message: "Task updated" });
  } catch (err) {
    console.error("Update error:", err);
    return NextResponse.json({ message: "Failed to update task", error: String(err) }, { status: 500 });
  }
}

// DELETE to remove task
export async function DELETE(
  req: NextRequest, 
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ Await context.params

    console.log("Deleting task with ID:", id); // Debug log

    if (!id) {
      return NextResponse.json({ message: "Task id missing" }, { status: 400 });
    }

    const taskRef = doc(db, "tasks", id);
    await deleteDoc(taskRef);

    return NextResponse.json({ message: "Task deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json({ message: "Failed to delete task", error: String(err) }, { status: 500 });
  }
}