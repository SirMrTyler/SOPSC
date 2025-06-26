// App.tsx
// ngrok http https://localhost:5001
import React, { useState } from 'react';

import Login from './components/LogIn';
import LandingPage from './components/LandingPage';

export default function App() {
  const [user, setUser] = useState<any | null>(null);

  const handleLogin = (u: any) => {
    setUser(u);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return user ? (
    <LandingPage user={user} onLogout={handleLogout} />
  ) : (
    <Login onLogin={handleLogin} />
  );
}