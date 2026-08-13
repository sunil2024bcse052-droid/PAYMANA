import { useState, useEffect } from 'react';
import { getProjects } from '../api/projects';
import ProjectCard from '../components/ProjectCard';

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    getProjects()
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
  }, []);

  if (loading) return <p style={{ padding: '20px' }}>Loading projects...</p>;
  if (error) return <p style={{ padding: '20px', color: 'red' }}>Error: {error}</p>;

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
      <h1>Paimana</h1>
      <p style={{ color: '#64748b' }}>Public government project tracker</p>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

export default ProjectList;