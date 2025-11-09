"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, LogOut, Edit2, X, Check } from "lucide-react";
import { auth, logoutUser } from "./lib/auth";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Task } from "./types/task";

export default function HomePage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Low");
  
  // Edit mode state
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
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
        router.push("/login");
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
    if (!title || !description || !priority || !userEmail) return;

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, priority, userEmail }),
      });

      if (res.ok) {
        const newTask = await res.json();
        setTasks((prev) => [...prev, newTask]);
        setTitle("");
        setDescription("");
        setPriority("Low");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle task completion
  const handleToggleComplete = async (task: Task) => {
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed }),
      });

      if (res.ok) {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === task.id ? { ...t, completed: !t.completed } : t
          )
        );
      }
    } catch (err) {
      console.error("Error toggling task:", err);
    }
  };

  // Start editing a task
  const handleStartEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditPriority(task.priority);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditTitle("");
    setEditDescription("");
    setEditPriority("Low");
  };

  // Save edited task
  const handleSaveEdit = async (taskId: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          priority: editPriority,
        }),
      });

      if (res.ok) {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? { ...t, title: editTitle, description: editDescription, priority: editPriority }
              : t
          )
        );
        handleCancelEdit();
      }
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
      }
    } catch (err) {
      console.error("Error deleting task:", err);
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
      <p className="mb-6 text-lg text-gray-300">
        Hello, {userEmail ? userEmail : "user"}
      </p>

      {/* Grid Layout: Form Left, Tasks Right */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Todo Input - Left Side */}
        <div className="bg-slate-800 p-4 rounded-xl shadow-lg flex flex-col gap-3 h-fit sticky top-6">
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

        {/* Todo Items - Right Side */}
        <div className="space-y-4">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 p-4 rounded-xl shadow"
          >
            {editingTaskId === task.id ? (
              // Edit Mode
              <div className="space-y-3">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 p-2 rounded-lg outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 p-2 rounded-lg outline-none focus:border-blue-500"
                />
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value as "Low" | "Medium" | "High")}
                  className="w-full bg-slate-700 text-white p-2 rounded-lg focus:outline-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveEdit(task.id)}
                    className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm flex items-center gap-1"
                  >
                    <Check size={16} /> Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-sm flex items-center gap-1"
                  >
                    <X size={16} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="accent-green-400 w-5 h-5 cursor-pointer"
                    checked={task.completed}
                    onChange={() => handleToggleComplete(task)}
                  />
                  <div>
                    <h3 className={`text-lg font-semibold ${task.completed ? 'line-through opacity-50' : ''}`}>
                      {task.title}
                    </h3>
                    <p className={`text-sm opacity-80 ${task.completed ? 'line-through' : ''}`}>
                      {task.description}
                    </p>
                    <p
                      className="text-xs mt-1"
                      style={{
                        color:
                          task.priority === "High" ? "#3b82f6" :
                          task.priority === "Medium" ? "#facc15" :
                          "#10b981",
                      }}
                    >
                      Priority: {task.priority}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-center">
                  <button
                    onClick={() => handleStartEdit(task)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm flex items-center gap-1"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg text-sm flex items-center gap-1"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            )}
          </motion.div>
                  ))}
        </div>
      </div>
    </div>
  );
}