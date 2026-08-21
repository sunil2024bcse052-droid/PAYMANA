import { useState, useEffect } from 'react';
import { getPendingUsers, reviewPendingUser } from '../api/auth';

function PendingUsers({ token, user }) {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);

  function loadPending() {
    setLoading(true);
    getPendingUsers(token)
      .then((data) => {
        setPending(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }

  useEffect(() => {
    if (token) loadPending();
  }, [token]);

  if (!user || user.role !== 'ADMIN') {
    return (
      <div style={{ maxWidth: '500px', margin: '60px auto', padding: '20px', textAlign: 'center' }}>
        <p style={{ color: '#64748b' }}>You don't have permission to view this page.</p>
      </div>
    );
  }

  async function handleReview(id, decision) {
    setActionError(null);
    try {
      await reviewPendingUser(id, decision, token);
      loadPending();
    } catch (err) {
      setActionError(err.message);
    }
  }

  if (loading) return <p style={{ padding: '20px' }}>Loading...</p>;
  if (error) return <p style={{ padding: '20px', color: 'red' }}>Error: {error}</p>;

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Pending Account Requests</h1>
      <p style={styles.subtitle}>
        People who registered requesting Government Employee or Contractor
        access. Review and approve or reject each request.
      </p>

      {actionError && <p style={{ color: '#ef4444' }}>{actionError}</p>}

      {pending.length === 0 && (
        <div style={styles.emptyState}>
          <p style={{ fontSize: '32px', margin: 0 }}>✅</p>
          <p style={{ color: '#64748b' }}>No pending requests right now.</p>
        </div>
      )}

      {pending.map((p) => (
        <div key={p.id} style={styles.card}>
          <div>
            <h3 style={styles.name}>{p.name}</h3>
            <p style={styles.email}>{p.email}</p>
            <span style={styles.roleTag}>{p.requestedRole?.replace('_', ' ')}</span>
            <p style={styles.date}>
              Requested {new Date(p.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div style={styles.actions}>
            <button onClick={() => handleReview(p.id, 'APPROVED')} style={styles.approveBtn}>
              Approve
            </button>
            <button onClick={() => handleReview(p.id, 'REJECTED')} style={styles.rejectBtn}>
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  page: {
    maxWidth: '700px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  title: {
    margin: '0 0 8px 0',
  },
  subtitle: {
    color: '#64748b',
    fontSize: '13.5px',
    lineHeight: 1.6,
    marginBottom: '28px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 0',
  },
  card: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '18px 20px',
    marginBottom: '12px',
    backgroundColor: '#fff',
    flexWrap: 'wrap',
    gap: '12px',
  },
  name: {
    margin: '0 0 4px 0',
    fontSize: '16px',
  },
  email: {
    margin: '0 0 8px 0',
    color: '#64748b',
    fontSize: '13.5px',
  },
  roleTag: {
    backgroundColor: '#eff6ff',
    color: '#2563eb',
    fontSize: '11px',
    fontWeight: 700,
    padding: '3px 10px',
    borderRadius: '20px',
    letterSpacing: '0.03em',
  },
  date: {
    color: '#94a3b8',
    fontSize: '12px',
    margin: '8px 0 0 0',
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  approveBtn: {
    backgroundColor: '#16a34a',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '13.5px',
    fontWeight: 600,
  },
  rejectBtn: {
    backgroundColor: '#fff',
    color: '#ef4444',
    border: '1px solid #fecaca',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '13.5px',
    fontWeight: 600,
  },
};

export default PendingUsers;