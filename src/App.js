import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ResetPassword from './pages/ResetPassword';
import ChangePassword from './pages/ChangePassword';

function AppRoutes() {
  const [showLogin, setShowLogin] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleForm = () => setShowLogin(!showLogin);

  // 🔁 Detect password recovery link and redirect
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('type=recovery')) {
      navigate('/reset-password' + hash);
    }
  }, [location]);

  return (
    <Routes>
      <Route
        path="/"
        element={showLogin ? <Login onToggle={toggleForm} /> : <Register onToggle={toggleForm} />}
      />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/change-password" element={<ChangePassword />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
