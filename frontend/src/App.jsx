import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ProjectList from './pages/ProjectList';
import ProjectDetail from './pages/ProjectDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import AddProject from './pages/AddProject';
import ApprovalQueue from './pages/ApprovalQueue';
import Dashboard from './pages/Dashboard';
import ManageUsers from './pages/ManageUsers';
import PendingUsers from './pages/PendingUsers';
import MyProjects from './pages/MyProjects';
import Footer from './components/Footer';
import logo from './assets/logopaimana.png';

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
  const isAdmin = user && user.role === 'ADMIN';
  const isContractor = user && user.role === 'CONTRACTOR';

  return (
    <div>
      <nav style={styles.nav}>
        <Link to="/" style={styles.logo}>
          <img src={logo} alt="Paimana" style={styles.logoImg} />
        </Link>
        <div style={styles.navLinks}>
          <Link to="/dashboard" style={styles.navLink}>Dashboard</Link>
          {isContractor && (
            <Link to="/my-projects" style={styles.navLinkAccent}>My Projects</Link>
          )}
          {canAddProject && (
            <Link to="/add-project" style={styles.navLinkAccent}>+ Add Project</Link>
          )}
          {canReview && (
            <Link to="/approval-queue" style={styles.navLink}>Approval Queue</Link>
          )}
          {isAdmin && (
            <Link to="/manage-users" style={styles.navLink}>Manage Users</Link>
          )}
          {isAdmin && (
            <Link to="/pending-users" style={styles.navLink}>Pending Requests</Link>
          )}
          {user ? (
            <span style={styles.userChip}>
              {user.name}
              <span style={styles.roleTag}>{user.role}</span>
              <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </span>
          ) : (
            <>
              <Link to="/register" style={styles.navLink}>Register</Link>
              <Link to="/login" style={styles.loginBtn}>Login</Link>
            </>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<ProjectList />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects/:id" element={<ProjectDetail token={token} user={user} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add-project" element={<AddProject token={token} user={user} />} />
        <Route path="/approval-queue" element={<ApprovalQueue token={token} user={user} />} />
        <Route path="/manage-users" element={<ManageUsers token={token} user={user} />} />
        <Route path="/pending-users" element={<PendingUsers token={token} user={user} />} />
        <Route path="/my-projects" element={<MyProjects user={user} />} />
      </Routes>

      <Footer />
    </div>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '6px 28px',
    backgroundColor: '#0f172a',
    borderBottom: '1px solid #1e293b',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    flexWrap: 'wrap',
    gap: '10px',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
  },
  logoImg: {
    height: '72px',
    width: 'auto',
    display: 'block',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap',
  },
  navLink: {
    color: '#cbd5e1',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 500,
  },
  navLinkAccent: {
    color: '#5eead4',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 600,
  },
  loginBtn: {
    backgroundColor: '#2563eb',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 600,
  },
  userChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#e2e8f0',
  },
  roleTag: {
    backgroundColor: 'rgba(94, 234, 212, 0.15)',
    color: '#5eead4',
    fontSize: '11px',
    fontWeight: 700,
    padding: '3px 8px',
    borderRadius: '20px',
    letterSpacing: '0.03em',
  },
  logoutBtn: {
    border: '1px solid #334155',
    backgroundColor: '#1e293b',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#cbd5e1',
  },
};

export default App;