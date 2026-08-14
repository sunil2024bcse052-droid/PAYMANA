import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ProjectList from './pages/ProjectList';
import ProjectDetail from './pages/ProjectDetail';
import Login from './pages/Login';
import AddProject from './pages/AddProject';

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

  return (
    <div>
      <nav style={{ padding: '12px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}><strong>Paimana</strong></Link>
        <div>
          {canAddProject && (
            <Link to="/add-project" style={{ marginRight: '16px' }}>+ Add Project</Link>
          )}
          {user ? (
            <span>
              Logged in as {user.name} ({user.role}){' '}
              <button onClick={handleLogout}>Logout</button>
            </span>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<ProjectList />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/add-project" element={<AddProject token={token} user={user} />} />
      </Routes>
    </div>
  );
}

export default App;