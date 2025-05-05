import React from 'react';

export default function Login({ onToggle }) {
  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-[#080710] overflow-hidden">
      {/* Gradient Shapes */}
      <div className="absolute w-[430px] h-[520px]">
        <div className="absolute w-[200px] h-[200px] rounded-full bg-gradient-to-br from-[#1845ad] to-[#23a2f6] -left-20 -top-20"></div>
        <div className="absolute w-[200px] h-[200px] rounded-full bg-gradient-to-r from-[#ff512f] to-[#f09819] -right-8 -bottom-20"></div>
      </div>

      {/* Login Form */}
      <form className="relative z-10 bg-white/10 backdrop-blur-lg border border-white/10 shadow-lg w-[400px] h-[500px] rounded-xl px-8 py-12 text-white flex flex-col">
        <h3 className="text-3xl font-medium text-center mb-6">Login Here</h3>

        <label className="mt-4 text-white text-sm font-medium">Username</label>
        <input
          type="text"
          placeholder="Email or Phone"
          className="bg-white/20 text-white px-3 py-2 rounded-md mt-1 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <label className="mt-4 text-white text-sm font-medium">Password</label>
        <input
          type="password"
          placeholder="Password"
          className="bg-white/20 text-white px-3 py-2 rounded-md mt-1 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button className="mt-8 bg-white text-black py-3 rounded-md font-semibold hover:bg-gray-200 transition">
          Log In
        </button>

        <p className="mt-6 text-center text-sm text-gray-300">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onToggle}
            className="text-blue-400 hover:underline"
          >
            Register here
          </button>
        </p>
      </form>
    </div>
  );
}
