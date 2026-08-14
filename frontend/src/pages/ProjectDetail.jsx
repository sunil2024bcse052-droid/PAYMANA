import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProject } from '../api/projects';

function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    getProject(id)
      .then((data) => {
        if (!ignore) {
          setProject(data);
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
  }, [id]);

  if (loading) return <p style={{ padding: '20px' }}>Loading...</p>;
  if (error) return <p style={{ padding: '20px', color: 'red' }}>Error: {error}</p>;
  if (!project) return null;

  const { name, category, state, district, agency, status, percentComplete, budget, milestones, sources, editLogs } = project;

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
      <Link to="/">&larr; Back to all projects</Link>
      <h1>{name}</h1>
      <p style={{ color: '#64748b' }}>{category} · {state}{district ? `, ${district}` : ''} · {agency}</p>
      <p><strong>Status:</strong> {status} ({percentComplete}% complete)</p>

      {budget && (
        <div style={{ margin: '20px 0', padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
          <h3>Budget</h3>
          <p>Sanctioned: ₹{(budget.sanctionedAmount / 10000000).toFixed(1)} Cr</p>
          <p>Released: ₹{(budget.releasedAmount / 10000000).toFixed(1)} Cr</p>
          <p>Utilized: ₹{(budget.utilizedAmount / 10000000).toFixed(1)} Cr</p>
        </div>
      )}

      {milestones && milestones.length > 0 && (
        <div style={{ margin: '20px 0' }}>
          <h3>Timeline</h3>
          <ul>
            {milestones.map((m) => (
              <li key={m.id}>{new Date(m.date).toLocaleDateString()} — {m.title}</li>
            ))}
          </ul>
        </div>
      )}

      {sources && sources.length > 0 && (
        <div style={{ margin: '20px 0' }}>
          <h3>Sources</h3>
          <ul>
            {sources.map((s) => (
              <li key={s.id}><a href={s.url} target="_blank" rel="noreferrer">{s.title}</a></li>
            ))}
          </ul>
        </div>
      )}

      {editLogs && editLogs.length > 0 && (
        <div style={{ margin: '20px 0' }}>
          <h3>Edit History</h3>
          <ul>
            {editLogs.map((log) => (
              <li key={log.id}>
                {new Date(log.createdAt).toLocaleDateString()} — {log.action}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ProjectDetail;