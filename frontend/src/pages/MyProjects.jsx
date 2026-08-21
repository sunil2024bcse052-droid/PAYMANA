import { useState, useEffect } from 'react';
import { getProjects } from '../api/projects';
import ProjectCard from '../components/ProjectCard';

function MyProjects({ user }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'CONTRACTOR') return;

    let ignore = false;
    getProjects({ contractorId: user.id, limit: 50 })
      .then((data) => {
        if (!ignore) {
          setProjects(data.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [user]);

  if (!user || user.role !== 'CONTRACTOR') {
    return (
      <div style={{ maxWidth: '500px', margin: '60px auto', padding: '20px', textAlign: 'center' }}>
        <p style={{ color: '#64748b' }}>This page is only available to contractor accounts.</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>My Projects</h1>
      <p style={styles.subtitle}>
        Projects assigned to you. Click one to submit a progress update.
      </p>

      {loading && <p style={styles.status}>Loading...</p>}
      {error && <p style={{ ...styles.status, color: '#ef4444' }}>Error: {error}</p>}

      {!loading && !error && projects.length === 0 && (
        <div style={styles.emptyState}>
          <p style={{ fontSize: '32px', margin: 0 }}>📋</p>
          <p style={styles.status}>
            No projects are currently assigned to you. Contact the department
            that hired you if you believe this is a mistake.
          </p>
        </div>
      )}

      <div style={styles.grid}>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  title: {
    margin: '0 0 8px 0',
  },
  subtitle: {
    color: '#64748b',
    fontSize: '13.5px',
    marginBottom: '28px',
  },
  status: {
    color: '#64748b',
    padding: '20px 0',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 0',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
  },
};

export default MyProjects;