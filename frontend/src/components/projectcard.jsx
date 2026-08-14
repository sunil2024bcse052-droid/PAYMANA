import { Link } from 'react-router-dom';

function ProjectCard({ project }) {
  const { id, name, category, state, agency, status, percentComplete, budget } = project;

  const statusColors = {
    PLANNED: '#94a3b8',
    ONGOING: '#3b82f6',
    DELAYED: '#ef4444',
    COMPLETED: '#22c55e',
  };

  return (
    <Link to={`/projects/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h3 style={styles.name}>{name}</h3>
          <span style={{ ...styles.badge, backgroundColor: statusColors[status] }}>
            {status}
          </span>
        </div>
        <p style={styles.meta}>{category} · {state} · {agency}</p>
        <div style={styles.progressBarOuter}>
          <div style={{ ...styles.progressBarInner, width: `${percentComplete}%` }} />
        </div>
        <p style={styles.meta}>{percentComplete}% complete</p>
        {budget && (
          <p style={styles.budget}>
            ₹{(budget.sanctionedAmount / 10000000).toFixed(1)} Cr sanctioned
          </p>
        )}
      </div>
    </Link>
  );
}

const styles = {
  card: {
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '12px',
    backgroundColor: '#fff',
    cursor: 'pointer',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    margin: 0,
    fontSize: '16px',
  },
  badge: {
    color: '#fff',
    fontSize: '12px',
    padding: '2px 8px',
    borderRadius: '4px',
  },
  meta: {
    color: '#64748b',
    fontSize: '14px',
    margin: '6px 0',
  },
  progressBarOuter: {
    width: '100%',
    height: '8px',
    backgroundColor: '#e2e8f0',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressBarInner: {
    height: '100%',
    backgroundColor: '#3b82f6',
  },
  budget: {
    fontWeight: 'bold',
    fontSize: '14px',
    marginTop: '6px',
  },
};

export default ProjectCard;