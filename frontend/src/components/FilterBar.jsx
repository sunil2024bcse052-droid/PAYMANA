function FilterBar({ filters, onChange }) {
  function handleFieldChange(field, value) {
    onChange({ ...filters, [field]: value });
  }

  return (
    <div style={styles.container}>
      <input
        type="text"
        placeholder="Search by name or agency..."
        value={filters.search || ''}
        onChange={(e) => handleFieldChange('search', e.target.value)}
        style={styles.search}
      />

      <select
        value={filters.category || ''}
        onChange={(e) => handleFieldChange('category', e.target.value)}
        style={styles.select}
      >
        <option value="">All Categories</option>
        <option value="RAIL">Rail</option>
        <option value="METRO">Metro</option>
        <option value="ROAD">Road</option>
        <option value="BRIDGE">Bridge</option>
        <option value="BUILDING">Building</option>
        <option value="IRRIGATION">Irrigation</option>
        <option value="POWER">Power</option>
        <option value="OTHER">Other</option>
      </select>

      <select
        value={filters.status || ''}
        onChange={(e) => handleFieldChange('status', e.target.value)}
        style={styles.select}
      >
        <option value="">All Statuses</option>
        <option value="PLANNED">Planned</option>
        <option value="ONGOING">Ongoing</option>
        <option value="DELAYED">Delayed</option>
        <option value="COMPLETED">Completed</option>
      </select>

      <input
        type="text"
        placeholder="State (e.g. Kerala)"
        value={filters.state || ''}
        onChange={(e) => handleFieldChange('state', e.target.value)}
        style={styles.select}
      />
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginBottom: '20px',
  },
  search: {
    flex: '1 1 200px',
    padding: '8px',
  },
  select: {
    padding: '8px',
    flex: '1 1 140px',
  },
};

export default FilterBar;