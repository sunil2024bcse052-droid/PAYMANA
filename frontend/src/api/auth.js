const API_BASE = 'http://localhost:5000/api';

// Sends email + password to the backend, gets back a token + user info
export async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error || 'Login failed');
  }

  return res.json(); // { token, user }
}
// Admin-only: creates a GOVT_EMPLOYEE, CONTRACTOR, or ADMIN account
export async function createStaffUser(userData, token) {
  const res = await fetch(`${API_BASE}/auth/staff`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error || 'Failed to create staff account');
  }

  return res.json();
}
// Public self-registration. requestedRole is optional - "GOVT_EMPLOYEE" or
// "CONTRACTOR" puts the account into PENDING status awaiting admin approval;
// leaving it blank creates an instantly-active VIEWER account.
export async function register(name, email, password, requestedRole) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, requestedRole }),
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error || 'Registration failed');
  }

  return res.json();
}
// Admin-only: fetches all self-registered accounts awaiting approval
export async function getPendingUsers(token) {
  const res = await fetch(`${API_BASE}/auth/pending`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch pending users');
  }

  return res.json();
}

// Admin-only: approves or rejects a pending registration
export async function reviewPendingUser(id, decision, token) {
  const res = await fetch(`${API_BASE}/auth/pending/${id}/review`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ decision }),
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error || 'Failed to review user');
  }

  return res.json();
}
// Employee/Admin only: fetches all registered, active contractors
export async function getContractors(token) {
  const res = await fetch(`${API_BASE}/auth/contractors`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch contractors');
  }

  return res.json();
}