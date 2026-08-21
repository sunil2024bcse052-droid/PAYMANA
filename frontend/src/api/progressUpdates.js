const API_BASE = 'http://localhost:5000/api';

// Contractor submits a progress update
export async function submitProgressUpdate(data, token) {
  const res = await fetch(`${API_BASE}/progress-updates`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error || 'Failed to submit update');
  }

  return res.json();
}

// Govt employee fetches all pending updates
export async function getPendingUpdates(token) {
  const res = await fetch(`${API_BASE}/progress-updates/pending`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch pending updates');
  }

  return res.json();
}

// Govt employee approves or rejects an update
export async function reviewProgressUpdate(id, decision, reviewNotes, token) {
  const res = await fetch(`${API_BASE}/progress-updates/${id}/review`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ decision, reviewNotes }),
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error || 'Failed to review update');
  }

  return res.json();
}
// Uploads a proof photo, returns { url }
export async function uploadProofPhoto(file, token) {
  const formData = new FormData();
  formData.append('photo', file);

  const res = await fetch(`${API_BASE}/progress-updates/upload-proof`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      // Note: no Content-Type header here - the browser sets it automatically
      // for FormData, including the required boundary string.
    },
    body: formData,
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error || 'Failed to upload photo');
  }

  return res.json();
}