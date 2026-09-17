import { NavLink, Link } from 'react-router-dom';

export default function Navbar({ token, user, onLogout }) {
  return <header className="site-nav">
    <Link to={token ? '/dashboard' : '/'} className="brand-lockup"><span className="brand-cup">☕</span><span><strong>Café Rewards</strong><small>loyalty, served warm</small></span></Link>
    <nav className="nav-links" aria-label="Main navigation">
      {!token ? <><NavLink to="/" className="nav-link">Home</NavLink><NavLink to="/login" className="nav-link">Sign in</NavLink><Link to="/register" className="nav-cta">Join the club <span>↗</span></Link></> : <><NavLink to="/dashboard" className="nav-link">My rewards</NavLink><NavLink to="/counter" className="nav-link">☕ Counter</NavLink><NavLink to="/admin" className="nav-link">Analytics</NavLink><NavLink to="/profile" className="nav-link nav-profile">👤 {user?.name || 'Profile'}</NavLink><button onClick={onLogout} className="nav-link nav-logout">Log out</button></>}
    </nav>
  </header>;
}
