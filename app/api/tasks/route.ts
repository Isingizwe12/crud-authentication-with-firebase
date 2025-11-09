import { NextRequest, NextResponse } from "next/server";
import { db } from "../../lib/firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { Task } from "../../types/task";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, priority, userEmail } = body;

    if (!title || !description || !priority || !userEmail) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const newTask: Omit<Task, "id" | "completed"> & { completed: boolean } = {
      title,
      description,
      priority,
      userEmail,
      completed: false,
    };

    const docRef = await addDoc(collection(db, "tasks"), newTask);

    return NextResponse.json({ id: docRef.id, ...newTask }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating task", error }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get("userEmail");

    if (!userEmail) {
      return NextResponse.json({ message: "Missing userEmail" }, { status: 400 });
    }

    const q = query(collection(db, "tasks"), where("userEmail", "==", userEmail));
    const querySnapshot = await getDocs(q);
    const tasks: Task[] = [];
    querySnapshot.forEach((docSnap) => {
      tasks.push({ ...(docSnap.data() as Task), id: docSnap.id });
    });

    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching tasks", error }, { status: 500 });
  }
}
