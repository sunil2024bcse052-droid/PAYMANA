import { useState, useEffect } from 'react';
import { getProjects } from '../api/projects';
import ProjectCard from '../components/ProjectCard';
import FilterBar from '../components/FilterBar';

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    let ignore = false;
    setLoading(true);

    // Remove empty filter values so we don't send ?state=&category= etc.
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value)
    );

    getProjects(activeFilters)
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
  }, [filters]);

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
      <h1>Paimana</h1>
      <p style={{ color: '#64748b' }}>Public government project tracker</p>

      <FilterBar filters={filters} onChange={setFilters} />

      {loading && <p>Loading projects...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!loading && !error && projects.length === 0 && <p>No projects match these filters.</p>}

      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}


export default ProjectList;