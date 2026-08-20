import { useState, useEffect } from 'react';
import { getStats } from '../api/projects';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    getStats()
      .then((data) => {
        if (!ignore) {
          setStats(data);
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

  if (loading) return <p style={{ padding: '20px' }}>Loading stats...</p>;
  if (error) return <p style={{ padding: '20px', color: 'red' }}>Error: {error}</p>;
  if (!stats) return null;

  const statusColors = {
    PLANNED: '#94a3b8',
    ONGOING: '#3b82f6',
    DELAYED: '#ef4444',
    COMPLETED: '#22c55e',
  };

  const utilizationPercent = stats.totalSanctioned > 0
    ? ((stats.totalUtilized / stats.totalSanctioned) * 100).toFixed(1)
    : 0;

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
      <h1>Dashboard</h1>
      <p style={{ color: '#64748b' }}>Overview of all tracked projects</p>

      <div style={styles.cardsRow}>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Total Sanctioned</p>
          <p style={styles.statValue}>₹{(stats.totalSanctioned / 10000000).toFixed(1)} Cr</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Total Utilized</p>
          <p style={styles.statValue}>₹{(stats.totalUtilized / 10000000).toFixed(1)} Cr</p>
          <p style={styles.statSub}>{utilizationPercent}% of sanctioned</p>
        </div>
        <div style={{ ...styles.statCard, borderColor: '#ef4444' }}>
          <p style={styles.statLabel}>Delayed Projects</p>
          <p style={{ ...styles.statValue, color: '#ef4444' }}>{stats.delayedCount}</p>
        </div>
      </div>

      <h3 style={{ marginTop: '30px' }}>Projects by Status</h3>
      <div>
        {stats.byStatus.map((item) => (
          <div key={item.status} style={styles.statusRow}>
            <span
              style={{
                ...styles.statusDot,
                backgroundColor: statusColors[item.status] || '#94a3b8',
              }}
            />
            <span style={{ flex: 1 }}>{item.status}</span>
            <strong>{item._count}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  cardsRow: {
    display: 'flex',
    gap: '12px',
    marginTop: '20px',
    flexWrap: 'wrap',
  },
  statCard: {
    flex: '1 1 180px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '16px',
  },
  statLabel: {
    color: '#64748b',
    fontSize: '13px',
    margin: '0 0 6px 0',
  },
  statValue: {
    fontSize: '22px',
    fontWeight: 'bold',
    margin: 0,
  },
  statSub: {
    fontSize: '12px',
    color: '#94a3b8',
    margin: '4px 0 0 0',
  },
  statusRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid #f1f5f9',
  },
  statusDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    marginRight: '10px',
  },
};

export default Dashboard;