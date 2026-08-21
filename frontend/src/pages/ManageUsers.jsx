import { useState } from 'react';
import { createStaffUser } from '../api/auth';

function ManageUsers({ token, user }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'GOVT_EMPLOYEE',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  // Only ADMIN can even see this page
  if (!user || user.role !== 'ADMIN') {
    return (
      <div style={{ maxWidth: '500px', margin: '60px auto', padding: '20px', textAlign: 'center' }}>
        <p style={{ color: '#64748b' }}>You don't have permission to view this page.</p>
      </div>
    );
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSuccess(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const created = await createStaffUser(form, token);
      setSuccess(`Account created: ${created.name} (${created.role})`);
      setForm({ name: '', email: '', password: '', role: 'GOVT_EMPLOYEE' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Manage Users</h1>
        <p style={styles.subtitle}>
          Create accounts for government employees, contractors, or other admins.
          These roles cannot be self-registered — only an admin can grant them.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Temporary Password</label>
            <input
              type="text"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Role</label>
            <select name="role" value={form.role} onChange={handleChange} style={styles.input}>
              <option value="GOVT_EMPLOYEE">Government Employee</option>
              <option value="CONTRACTOR">Contractor</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {error && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>{success}</p>}

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  container: {
    maxWidth: '480px',
    margin: '0 auto',
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
  form: {
    backgroundColor: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '24px',
  },
  field: {
    marginBottom: '16px',
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
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    boxSizing: 'border-box',
    fontSize: '14px',
  },
  error: {
    color: '#ef4444',
    fontSize: '13.5px',
  },
  success: {
    color: '#16a34a',
    fontSize: '13.5px',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    marginTop: '4px',
  },
};

export default ManageUsers;