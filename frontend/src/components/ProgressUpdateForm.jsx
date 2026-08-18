import { useState } from 'react';
import { submitProgressUpdate } from '../api/progressUpdates';

function ProgressUpdateForm({ projectId, token, onSubmitted }) {
  const [percentComplete, setPercentComplete] = useState('');
  const [amountUtilized, setAmountUtilized] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await submitProgressUpdate(
        {
          projectId,
          percentComplete: parseInt(percentComplete),
          amountUtilized: parseFloat(amountUtilized),
          notes,
        },
        token
      );
      setSuccess(true);
      setPercentComplete('');
      setAmountUtilized('');
      setNotes('');
      if (onSubmitted) onSubmitted();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', marginTop: '20px' }}>
      <h3>Submit Progress Update</h3>
      {success && <p style={{ color: 'green' }}>Submitted! Waiting for government employee approval.</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>% Complete</label>
          <input
            type="number"
            min="0"
            max="100"
            value={percentComplete}
            onChange={(e) => setPercentComplete(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Amount Utilized (₹)</label>
          <input
            type="number"
            value={amountUtilized}
            onChange={(e) => setAmountUtilized(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            rows={3}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ padding: '8px 16px' }}>
          {loading ? 'Submitting...' : 'Submit Update'}
        </button>
      </form>
    </div>
  );
}

export default ProgressUpdateForm;