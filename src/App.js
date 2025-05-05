import React, { useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => setIsLogin(!isLogin);

  return (
    <div>
      {isLogin ? <Login onToggle={toggleForm} /> : <Register onToggle={toggleForm} />}
    </div>
  );
}

export default App;
