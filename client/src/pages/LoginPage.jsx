import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function LoginPage({ onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`,
        formData
      );

      onLogin(response.data.token, response.data.member);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <div className="container" style={{ maxWidth: '520px', marginTop: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>☕</div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome Back!</h1>
          <p style={{ color: 'var(--text-light)', fontSize: '1.05rem' }}>Sign in to your café rewards account</p>
        </div>

        {error && <div className="error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>📧 Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your.email@example.com"
            />
          </div>

          <div className="form-group">
            <label>🔒 Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }} disabled={loading}>
            {loading ? '⏳ Signing In...' : '🚀 Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'linear-gradient(135deg, rgba(210,105,30,0.05), rgba(244,164,96,0.05))', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--text-light)', marginBottom: '0.5rem' }}>Not a member yet?</p>
          <a href="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '700', fontSize: '1.05rem' }}>Create Your Account →</a>
        </div>

        <div style={{ marginTop: '2rem', padding: '1rem', background: 'linear-gradient(135deg, rgba(76,175,80,0.08), rgba(200,230,201,0.08))', borderRadius: '10px', textAlign: 'center', border: '1px solid rgba(76,175,80,0.2)' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', margin: '0' }}>💡 Demo: Use any registered email to sign in</p>
        </div>
      </div>
    </main>
  );
}
