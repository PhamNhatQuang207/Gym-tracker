import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import gymImage from '../assets/background.jpg';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [session, setSession] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('HASH:', window.location.hash);
  
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('AUTH EVENT:', event);
      console.log('SESSION:', session);
      if (event === 'PASSWORD_RECOVERY' && session) {
        setSession(session);
      }
    });
  
    supabase.auth.getSession().then(({ data }) => {
      console.log('GET SESSION:', data);
      if (data.session) setSession(data.session);
    });
  
    return () => listener?.subscription.unsubscribe();
  }, []);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Password updated. Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    }
  };

  if (!session) {
    return (
      <div
        className="h-screen w-full flex items-center justify-center text-white text-xl font-semibold bg-black"
        style={{ backgroundImage: `url(${gymImage})`, backgroundSize: 'cover' }}
      >
        Verifying token from email... 🔐
      </div>
    );
  }

  return (
    <div
      className="w-full h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${gymImage})` }}
    >
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      <form
        onSubmit={handleUpdatePassword}
        className="relative z-10 bg-white/10 backdrop-blur-lg border border-white/10 shadow-lg w-[400px] rounded-xl px-8 py-10 text-white flex flex-col"
      >
        <h3 className="text-2xl font-medium text-center mb-4">Set New Password</h3>

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

        <button className="mt-6 bg-white text-black py-2 rounded-md font-semibold hover:bg-gray-200 transition">
          Update Password
        </button>
      </form>
    </div>
  );
}
