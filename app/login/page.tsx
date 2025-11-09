import React from 'react'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-black flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl shadow-2xl rounded-2xl p-8 w-full max-w-md border border-white/10">

        <h1 className="text-center text-3xl font-bold text-white mb-6 tracking-wide">Welcome </h1>

        <form className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Enter Your Email"
            className="p-3 rounded-xl bg-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="password"
            placeholder="Enter Your Password"
            className="p-3 rounded-xl bg-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 transition-all text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-300 mt-6">
          Do not have an account?{' '}
          <Link href="/register" className="text-blue-400 hover:text-blue-300 underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
