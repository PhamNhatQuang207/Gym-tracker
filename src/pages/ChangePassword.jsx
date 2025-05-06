import React, { useState } from 'react';
import { supabase } from '../supabase';
import gymImage from '../assets/background.jpg';

export default function ChangePassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Password updated successfully!');
    }
  };

  return (
    <div
      className="w-full h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${gymImage})` }}
    >
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      <form
        onSubmit={handleChangePassword}
        className="relative z-10 bg-white/10 backdrop-blur-lg border border-white/10 shadow-lg w-[400px] h-[400px] rounded-xl px-8 py-10 text-white flex flex-col"
      >
        <h3 className="text-2xl font-semibold text-center mb-4">Change Password</h3>

        {error && <p className="text-red-400 text-sm text-center mb-2">{error}</p>}
        {message && <p className="text-green-300 text-sm text-center mb-2">{message}</p>}

        <label className="mt-2 text-sm font-medium">New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          className="bg-white/20 text-white px-3 py-2 rounded-md mt-1 placeholder-gray-300"
          required
        />

        <label className="mt-4 text-sm font-medium">Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          className="bg-white/20 text-white px-3 py-2 rounded-md mt-1 placeholder-gray-300"
          required
        />

        <button className="mt-8 bg-white text-black py-2 rounded-md font-semibold hover:bg-gray-200 transition">
          Update Password
        </button>
      </form>
    </div>
  );
}
