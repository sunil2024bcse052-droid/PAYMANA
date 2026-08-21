import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../api/projects';
import { getContractors } from '../api/auth';

function AddProject({ token, user }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    category: 'ROAD',
    state: '',
    district: '',
    agency: '',
    sanctionedAmount: '',
    fundingSource: 'central',
    startDate: '',
    plannedDeadline: '',
    contractorId: '',
  });
  const [contractors, setContractors] = useState([]);
  const [contractorsError, setContractorsError] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const canView = user && (user.role === 'GOVT_EMPLOYEE' || user.role === 'ADMIN');

  useEffect(() => {
    if (!canView || !token) return;
    getContractors(token)
      .then(setContractors)
      .catch((err) => setContractorsError(err.message));
  }, [canView, token]);

  // Only GOVT_EMPLOYEE or ADMIN should even see this form
  if (!canView) {
    return (
      <div style={{ padding: '20px' }}>
        <p>You don't have permission to view this page. Please log in as a government employee.</p>
      </div>
    );
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const created = await createProject(
        {
          ...form,
          sanctionedAmount: parseFloat(form.sanctionedAmount),
          contractorId: form.contractorId || null,
        },
        token
      );
      navigate(`/projects/${created.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '20px' }}>
      <h1>Register New Project</h1>
      <form onSubmit={handleSubmit}>
        <Field label="Project Name" name="name" value={form.name} onChange={handleChange} required />

        <div style={{ marginBottom: '12px' }}>
          <label style={labelStyle}>Category</label>
          <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
            <option value="RAIL">Rail</option>
            <option value="METRO">Metro</option>
            <option value="ROAD">Road</option>
            <option value="BRIDGE">Bridge</option>
            <option value="BUILDING">Building</option>
            <option value="IRRIGATION">Irrigation</option>
            <option value="POWER">Power</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <Field label="State" name="state" value={form.state} onChange={handleChange} required />
        <Field label="District" name="district" value={form.district} onChange={handleChange} />
        <Field label="Implementing Agency" name="agency" value={form.agency} onChange={handleChange} required />
        <Field label="Sanctioned Amount (₹)" name="sanctionedAmount" type="number" value={form.sanctionedAmount} onChange={handleChange} required />

        <div style={{ marginBottom: '12px' }}>
          <label style={labelStyle}>Funding Source</label>
          <select name="fundingSource" value={form.fundingSource} onChange={handleChange} style={inputStyle}>
            <option value="central">Central</option>
            <option value="state">State</option>
            <option value="loan">Loan</option>
            <option value="PPP">PPP</option>
          </select>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={labelStyle}>Assign Contractor (optional — can assign later)</label>
          <select name="contractorId" value={form.contractorId} onChange={handleChange} style={inputStyle}>
            <option value="">No contractor assigned yet</option>
            {contractors.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.email})
              </option>
            ))}
          </select>
          {contractorsError && (
            <p style={{ color: '#ef4444', fontSize: '12.5px', margin: '4px 0 0 0' }}>
              Couldn't load contractors: {contractorsError}
            </p>
          )}
          {!contractorsError && contractors.length === 0 && (
            <p style={{ color: '#94a3b8', fontSize: '12.5px', margin: '4px 0 0 0' }}>
              No registered contractors yet. Approve one via Pending Requests, or create one via Manage Users.
            </p>
          )}
        </div>

        <Field label="Start Date" name="startDate" type="date" value={form.startDate} onChange={handleChange} />
        <Field label="Planned Deadline" name="plannedDeadline" type="date" value={form.plannedDeadline} onChange={handleChange} />

        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ padding: '10px 20px', marginTop: '10px' }}>
          {loading ? 'Creating...' : 'Create Project'}
        </button>
      </form>
    </div>
  );
}

function Field({ label, name, value, onChange, type = 'text', required = false }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        style={inputStyle}
      />
    </div>
  );
}

const labelStyle = { display: 'block', marginBottom: '4px', fontSize: '14px' };
const inputStyle = { width: '100%', padding: '8px', boxSizing: 'border-box' };

export default AddProject;