import { useState } from 'react';
import { submitProgressUpdate, uploadProofPhoto } from '../api/progressUpdates';

function ProgressUpdateForm({ projectId, token, onSubmitted }) {
  const [percentComplete, setPercentComplete] = useState('');
  const [amountUtilized, setAmountUtilized] = useState('');
  const [notes, setNotes] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let proofUrl = null;

      // If a photo was selected, upload it first and get back its URL
      if (photoFile) {
        setUploading(true);
        const uploadResult = await uploadProofPhoto(photoFile, token);
        proofUrl = uploadResult.url;
        setUploading(false);
      }

      await submitProgressUpdate(
        {
          projectId,
          percentComplete: parseInt(percentComplete),
          amountUtilized: parseFloat(amountUtilized),
          notes,
          proofUrl,
        },
        token
      );

      setSuccess(true);
      setPercentComplete('');
      setAmountUtilized('');
      setNotes('');
      setPhotoFile(null);
      setPhotoPreview(null);
      if (onSubmitted) onSubmitted();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  }

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Submit Progress Update</h3>
      {success && <p style={styles.successMsg}>Submitted! Waiting for government employee approval.</p>}
      <form onSubmit={handleSubmit}>
        <div style={styles.field}>
          <label style={styles.label}>% Complete</label>
          <input
            type="number"
            min="0"
            max="100"
            value={percentComplete}
            onChange={(e) => setPercentComplete(e.target.value)}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Amount Utilized (₹)</label>
          <input
            type="number"
            value={amountUtilized}
            onChange={(e) => setAmountUtilized(e.target.value)}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={styles.input}
            rows={3}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Proof Photo (optional but recommended)</label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handlePhotoChange}
            style={styles.fileInput}
          />
          {photoPreview && (
            <img src={photoPreview} alt="Proof preview" style={styles.preview} />
          )}
        </div>

        {error && <p style={styles.errorMsg}>{error}</p>}

        <button type="submit" disabled={loading} style={styles.button}>
          {uploading ? 'Uploading photo...' : loading ? 'Submitting...' : 'Submit Update'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  card: {
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '20px',
    marginTop: '24px',
    backgroundColor: '#fff',
  },
  title: {
    margin: '0 0 16px 0',
  },
  field: {
    marginBottom: '14px',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontSize: '13px',
    fontWeight: 600,
    color: '#334155',
  },
  input: {
    width: '100%',
    padding: '9px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    boxSizing: 'border-box',
    fontSize: '14px',
  },
  fileInput: {
    fontSize: '13.5px',
  },
  preview: {
    marginTop: '10px',
    maxWidth: '200px',
    maxHeight: '150px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    display: 'block',
  },
  errorMsg: {
    color: '#ef4444',
    fontSize: '13.5px',
  },
  successMsg: {
    color: '#16a34a',
    fontSize: '13.5px',
    marginBottom: '10px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
  },
};

export default ProgressUpdateForm;