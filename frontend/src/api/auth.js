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
