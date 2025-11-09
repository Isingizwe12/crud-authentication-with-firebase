"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, LogOut } from "lucide-react";
import { auth, logoutUser } from "../lib/auth";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Task } from "../types/task";

export default function HomePage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Low");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState<"Low" | "Medium" | "High">("Low");

  const router = useRouter();

  // Listen for logged-in user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        router.push("/login"); // redirect if not logged in
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Fetch tasks from API
  useEffect(() => {
    if (!userEmail) return;

    const fetchTasks = async () => {
      try {
        const res = await fetch(`/api/tasks?userEmail=${userEmail}`);
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTasks();
  }, [userEmail]);

  const handleLogout = async () => {
    await logoutUser();
    router.push("/login");
  };

  const handleAddTask = async () => {
    if (!title || !description) return;

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, priority, userEmail }),
      });
      const newTask = await res.json();
      setTasks((prev) => [...prev, newTask]);
      setTitle("");
      setDescription("");
      setPriority("Low");
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleCompleted = async (task: Task) => {
    try {
      await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed }),
      });
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditPriority(task.priority);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

    try {
      await fetch(`/api/tasks/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle, description: editDescription, priority: editPriority }),
      });

      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingId ? { ...t, title: editTitle, description: editDescription, priority: editPriority } : t
        )
      );
      setEditingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6 text-white flex flex-col items-center">
      {/* Top Bar */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Todo List</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* Greeting */}
      <p className="mb-6 text-lg text-gray-300">Hello, {userEmail ?? "user"}</p>

      {/* Add Task Form */}
      <div className="w-full max-w-2xl bg-slate-800 p-4 rounded-xl shadow-lg flex flex-col gap-3 mb-6">
        <input
          type="text"
          placeholder="Task title..."
          className="flex-1 bg-transparent border border-slate-700 p-3 rounded-lg outline-none focus:border-blue-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Task description..."
          className="flex-1 bg-transparent border border-slate-700 p-3 rounded-lg outline-none focus:border-blue-500"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select
          className="bg-slate-700 text-white p-3 rounded-lg focus:outline-none"
          value={priority}
          onChange={(e) => setPriority(e.target.value as "Low" | "Medium" | "High")}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button
          onClick={handleAddTask}
          className="bg-blue-600 p-3 rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2"
        >
          <Plus size={20} /> Add Task
        </button>
      </div>

      {/* Task List */}
      <div className="w-full max-w-2xl space-y-4">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 p-4 rounded-xl flex justify-between items-center shadow"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                className="accent-green-400 w-5 h-5"
                checked={task.completed}
                onChange={() => handleToggleCompleted(task)}
              />
              <div className="flex-1">
                {editingId === task.id ? (
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="bg-slate-700 p-2 rounded-lg text-white outline-none"
                    />
                    <input
                      type="text"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="bg-slate-700 p-2 rounded-lg text-white outline-none"
                    />
                    <select
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value as "Low" | "Medium" | "High")}
                      className="bg-slate-700 text-white p-2 rounded-lg outline-none"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-semibold">{task.title}</h3>
                    <p className="text-sm opacity-80">{task.description}</p>
                    <p
                      className="text-xs mt-1"
                      style={{
                        color:
                          task.priority === "High"
                            ? "#3b82f6"
                            : task.priority === "Medium"
                            ? "#facc15"
                            : "#10b981",
                      }}
                    >
                      Priority: {task.priority}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 items-center">
              {editingId === task.id ? (
                <button
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded-lg text-sm"
                  onClick={handleSaveEdit}
                >
                  Save
                </button>
              ) : (
                <button
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm"
                  onClick={() => handleEditTask(task)}
                >
                  Edit
                </button>
              )}
              <button
                className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg text-sm flex items-center gap-1"
                onClick={() => handleDeleteTask(task.id)}
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
