import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../api/projects';

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
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Only GOVT_EMPLOYEE or ADMIN should even see this form
  if (!user || (user.role !== 'GOVT_EMPLOYEE' && user.role !== 'ADMIN')) {
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
        { ...form, sanctionedAmount: parseFloat(form.sanctionedAmount) },
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