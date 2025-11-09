"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, LogOut } from "lucide-react";
import { auth, logoutUser } from "./lib/auth"   // import auth and logout
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
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

  const handleLogout = async () => {
    await logoutUser();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6 text-white flex flex-col items-center">
      {/* Top Bar */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Todo List </h1>
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

      {/* Todo Input */}
      <div className="w-full max-w-2xl bg-slate-800 p-4 rounded-xl shadow-lg flex items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Add a new task..."
          className="flex-1 bg-transparent border border-slate-700 p-3 rounded-lg outline-none focus:border-blue-500"
        />
        <button className="bg-blue-600 p-3 rounded-xl hover:bg-blue-700 transition">
          <Plus size={20} />
        </button>
      </div>

      {/* Todo Items */}
      <div className="w-full max-w-2xl space-y-4">
        {/* Example Todo Item */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800 p-4 rounded-xl flex justify-between items-center shadow"
        >
          <div className="flex items-center gap-3">
            <input type="checkbox" className="accent-green-400 w-5 h-5" />
            <div>
              <h3 className="text-lg font-semibold">Finish React project</h3>
              <p className="text-sm opacity-80">Complete all components and styling</p>
              <p className="text-xs text-blue-400 mt-1">Priority: High</p>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm">
              Edit
            </button>
            <button className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg text-sm flex items-center gap-1">
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800 p-4 rounded-xl flex justify-between items-center shadow"
        >
          <div className="flex items-center gap-3">
            <input type="checkbox" className="accent-green-400 w-5 h-5" />
            <div>
              <h3 className="text-lg font-semibold">Read documentation</h3>
              <p className="text-sm opacity-80">Review all Firebase integration steps</p>
              <p className="text-xs text-yellow-400 mt-1">Priority: Medium</p>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm">
              Edit
            </button>
            <button className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg text-sm flex items-center gap-1">
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
