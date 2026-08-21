import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/auth';

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    requestedRole: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await register(form.name, form.email, form.password, form.requestedRole || undefined);

      if (result.status === 'PENDING') {
        setSuccess(
          `Account created! Your request to join as a ${result.requestedRole.replace('_', ' ')} is now awaiting admin approval. You'll be able to log in once approved.`
        );
      } else {
        setSuccess('Account created! You can now log in.');
      }
      setForm({ name: '', email: '', password: '', requestedRole: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create an account</h1>
        <p style={styles.subtitle}>
          Anyone can browse Paimana without an account. Register below if you'd
          like to save preferences, or request access as a government employee
          or contractor.
        </p>

        {success ? (
          <div style={styles.successBox}>
            <p style={{ margin: 0 }}>{success}</p>
            <Link to="/login" style={styles.link}>Go to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
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
              <label style={styles.label}>Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>I am registering as...</label>
              <select
                name="requestedRole"
                value={form.requestedRole}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="">A member of the public (instant access)</option>
                <option value="GOVT_EMPLOYEE">Government Employee (requires admin approval)</option>
                <option value="CONTRACTOR">Contractor (requires admin approval)</option>
              </select>
            </div>

            {error && <p style={styles.error}>{error}</p>}

            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </form>
        )}

        {!success && (
          <p style={styles.footerText}>
            Already have an account? <Link to="/login" style={styles.link}>Log in</Link>
          </p>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '60px 20px',
  },
  card: {
    maxWidth: '440px',
    margin: '0 auto',
    backgroundColor: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '28px',
  },
  title: {
    margin: '0 0 8px 0',
  },
  subtitle: {
    color: '#64748b',
    fontSize: '13px',
    lineHeight: 1.6,
    marginBottom: '24px',
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
  successBox: {
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '8px',
    padding: '16px',
    color: '#166534',
    fontSize: '13.5px',
    lineHeight: 1.6,
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
  footerText: {
    textAlign: 'center',
    fontSize: '13.5px',
    color: '#64748b',
    marginTop: '18px',
  },
  link: {
    color: '#2563eb',
    fontWeight: 600,
    textDecoration: 'none',
  },
};

export default Register;