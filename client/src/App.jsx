import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import CounterPanel from './pages/CounterPanel';
import './App.css';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, [token]);

  const handleLogin = (token, userData) => {
    setToken(token);
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-content">
            <h1 className="logo">☕ Café Rewards</h1>
            <div className="nav-links">
              {!token ? (
                <>
                  <a href="/" className="nav-link">Home</a>
                  <a href="/login" className="nav-link">Login</a>
                  <a href="/register" className="nav-link">Register</a>
                </>
              ) : (
                <>
                  <a href="/dashboard" className="nav-link">Dashboard</a>
                  <a href="/counter" className="nav-link">Counter</a>
                  <span className="user-info">{user?.name} ({user?.tier})</span>
                  <button onClick={handleLogout} className="nav-link logout">Logout</button>
                </>
              )}
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage onLogin={handleLogin} />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/dashboard" element={token ? <Dashboard user={user} /> : <Navigate to="/login" />} />
          <Route path="/counter" element={token ? <CounterPanel user={user} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}
