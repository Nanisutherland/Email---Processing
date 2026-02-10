import { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import MainLayout from './components/MainLayout';
import './App.css';

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('email_processing_auth');
    if (isLoggedIn === 'true') {
      setAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    sessionStorage.setItem('email_processing_auth', 'true');
    setAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('email_processing_auth');
    setAuthenticated(false);
  };

  if (!authenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <MainLayout onLogout={handleLogout} />;
}

export default App;
