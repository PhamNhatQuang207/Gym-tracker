import React, { useState } from 'react';
import { supabase } from '../supabase';
import gymImage from '../assets/background.jpg';

export default function Login({ onToggle }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showReset, setShowReset] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError('Invalid email or password.');
    } else {
      setMessage('Logged in successfully!');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      setError(error.message);
    } else {
      setMessage('Reset email sent. Check your inbox.');
    }
  };

  return (
    <div
      className="w-full h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${gymImage})` }}
    >
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      <form
        onSubmit={showReset ? handleResetPassword : handleLogin}
        className="relative z-10 bg-white/10 backdrop-blur-lg border border-white/10 shadow-lg w-[400px] rounded-xl px-8 py-10 text-white flex flex-col"
      >
        <h3 className="text-3xl font-medium text-center mb-4">
          {showReset ? 'Reset Password' : 'Login'}
        </h3>

        {error && <p className="text-red-400 text-sm text-center mb-2">{error}</p>}
        {message && <p className="text-green-300 text-sm text-center mb-2">{message}</p>}

        <label className="mt-2 text-sm font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="bg-white/20 text-white px-3 py-2 rounded-md mt-1 placeholder-gray-300"
          required
        />

        {!showReset && (
          <>
            <label className="mt-4 text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="bg-white/20 text-white px-3 py-2 rounded-md mt-1 placeholder-gray-300"
              required
            />
          </>
        )}

        <button className="mt-8 bg-white text-black py-2 rounded-md font-semibold hover:bg-gray-200 transition">
          {showReset ? 'Send Reset Email' : 'Log In'}
        </button>

        <p className="mt-4 text-center text-sm text-gray-300">
          {showReset ? (
            <>
              Back to{' '}
              <button
                type="button"
                onClick={() => setShowReset(false)}
                className="text-blue-300 hover:underline"
              >
                Login
              </button>
            </>
          ) : (
            <>
              Forgot your password?{' '}
              <button
                type="button"
                onClick={() => setShowReset(true)}
                className="text-blue-300 hover:underline"
              >
                Reset here
              </button>
            </>
          )}
        </p>

        {!showReset && (
          <p className="mt-4 text-center text-sm text-gray-300">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onToggle}
              className="text-blue-300 hover:underline"
            >
              Register here
            </button>
          </p>
        )}
      </form>
    </div>
  );
}
