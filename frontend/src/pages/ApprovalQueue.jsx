import { useState, useEffect } from 'react';
import { getPendingUpdates, reviewProgressUpdate } from '../api/progressUpdates';

function ApprovalQueue({ token, user }) {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);

  function loadPending() {
    setLoading(true);
    getPendingUpdates(token)
      .then((data) => {
        setUpdates(data);
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

  if (!user || (user.role !== 'GOVT_EMPLOYEE' && user.role !== 'ADMIN')) {
    return <div style={{ padding: '20px' }}><p>You don't have permission to view this page.</p></div>;
  }

  async function handleReview(id, decision) {
    setActionError(null);
    const reviewNotes = decision === 'REJECTED' ? prompt('Reason for rejection (optional):') || '' : '';
    try {
      await reviewProgressUpdate(id, decision, reviewNotes, token);
      loadPending(); // refresh the list after acting
    } catch (err) {
      setActionError(err.message);
    }
  }

  if (loading) return <p style={{ padding: '20px' }}>Loading...</p>;
  if (error) return <p style={{ padding: '20px', color: 'red' }}>Error: {error}</p>;

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
      <h1>Approval Queue</h1>
      {actionError && <p style={{ color: 'red' }}>{actionError}</p>}
      {updates.length === 0 && <p>No pending updates.</p>}
      {updates.map((update) => (
        <div key={update.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', marginBottom: '12px' }}>
          <h3>{update.project.name}</h3>
          <p style={{ color: '#64748b' }}>Submitted by {update.contractor.name}</p>
          <p><strong>New % complete:</strong> {update.percentComplete}%</p>
          <p><strong>Amount utilized:</strong> ₹{(update.amountUtilized / 10000000).toFixed(1)} Cr</p>
          {update.notes && <p><strong>Notes:</strong> {update.notes}</p>}
          <div style={{ marginTop: '10px' }}>
            <button onClick={() => handleReview(update.id, 'APPROVED')} style={{ marginRight: '10px', padding: '6px 14px' }}>
              Approve
            </button>
            <button onClick={() => handleReview(update.id, 'REJECTED')} style={{ padding: '6px 14px' }}>
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ApprovalQueue;