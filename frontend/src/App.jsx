import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ProjectList from './pages/ProjectList';
import ProjectDetail from './pages/ProjectDetail';
import Login from './pages/Login';
import AddProject from './pages/AddProject';
import ApprovalQueue from './pages/ApprovalQueue';
import Dashboard from './pages/Dashboard';
import MapView from './pages/MapView';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  function handleLogin(newToken, newUser) {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  }

  function handleLogout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  const canAddProject = user && (user.role === 'GOVT_EMPLOYEE' || user.role === 'ADMIN');
  const canReview = user && (user.role === 'GOVT_EMPLOYEE' || user.role === 'ADMIN');

  return (
    <div>
      <nav style={styles.nav}>
        <Link to="/" style={styles.brand}>Paimana</Link>
        <div style={styles.navLinks}>
          <Link to="/map" style={styles.navLink}>Map</Link>
          <Link to="/dashboard" style={styles.navLink}>Dashboard</Link>
          {canAddProject && (
            <Link to="/add-project" style={{ ...styles.navLink, color: 'var(--color-accent)' }}>+ Add Project</Link>
          )}
          {canReview && (
            <Link to="/approval-queue" style={styles.navLink}>Approval Queue</Link>
          )}
          {user ? (
            <span style={styles.userInfo}>
              {user.name} <span style={styles.roleTag}>{user.role}</span>{' '}
              <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </span>
          ) : (
            <Link to="/login" style={styles.navLink}>Login</Link>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<ProjectList />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects/:id" element={<ProjectDetail token={token} user={user} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/add-project" element={<AddProject token={token} user={user} />} />
        <Route path="/approval-queue" element={<ApprovalQueue token={token} user={user} />} />
      </Routes>
    </div>
  );
}

const styles = {
  nav: {
    backgroundColor: 'var(--color-ink)',
    padding: '14px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
  },
  brand: {
    fontFamily: 'var(--font-display)',
    fontSize: '20px',
    fontWeight: 700,
    color: 'var(--color-paper)',
    textDecoration: 'none',
    letterSpacing: '0.01em',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
  },
  navLink: {
    color: 'var(--color-paper)',
    opacity: 0.85,
    textDecoration: 'none',
  },
  userInfo: {
    color: 'var(--color-paper)',
    opacity: 0.85,
  },
  roleTag: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    padding: '2px 8px',
    borderRadius: '2px 8px 2px 8px',
    fontSize: '11px',
    fontWeight: 600,
  },
  logoutBtn: {
    backgroundColor: 'transparent',
    border: '1px solid rgba(255,255,255,0.3)',
    color: 'var(--color-paper)',
    borderRadius: '4px',
    padding: '4px 10px',
    fontSize: '12px',
  },
};

export default App;