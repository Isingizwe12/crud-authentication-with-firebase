"use client";

import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '../lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { user, error } = await loginUser(email, password);
    if (user) {
      router.push('/'); // redirect to homepage/dashboard
    } else {
      setError(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-800 to-black flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl shadow-2xl rounded-2xl p-8 w-full max-w-md border border-white/10">
        <h1 className="text-center text-3xl font-bold text-white mb-6 tracking-wide">Login</h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded-xl bg-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="password"
            placeholder="Enter Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded-xl bg-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <button
            type="submit"
            className="w-full mt-2 bg-green-500 hover:bg-green-600 transition-all text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl"
          >
            Login
          </button>
        </form>

        {error && <p className="text-red-400 text-center mt-2">{error}</p>}

        <p className="text-center text-gray-300 mt-6">
          Do not have an account?{' '}
          <Link href="/register" className="text-blue-400 hover:text-blue-300 underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
