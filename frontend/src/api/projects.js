const API_BASE = 'http://localhost:5000/api';

// Fetches the project list, with optional filters (state, category, status, search)
export async function getProjects(filters = {}) {
  const params = new URLSearchParams(filters).toString();
  const res = await fetch(`${API_BASE}/projects?${params}`);
  if (!res.ok) {
    throw new Error('Failed to fetch projects');
  }
  return res.json();
}

// Fetches full detail for one project by its id
export async function getProject(id) {
  const res = await fetch(`${API_BASE}/projects/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch project');
  }
  return res.json();
}