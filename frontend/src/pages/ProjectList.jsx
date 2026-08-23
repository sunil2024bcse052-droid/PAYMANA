import { useState, useEffect } from 'react';
import { getProjects, getStats } from '../api/projects';
import ProjectCard from '../components/ProjectCard';
import FilterBar from '../components/FilterBar';

const CATEGORIES = [
  { value: 'RAIL', label: 'Rail', emoji: '🚆' },
  { value: 'METRO', label: 'Metro', emoji: '🚇' },
  { value: 'ROAD', label: 'Road', emoji: '🛣️' },
  { value: 'BRIDGE', label: 'Bridge', emoji: '🌉' },
  { value: 'BUILDING', label: 'Building', emoji: '🏛️' },
  { value: 'IRRIGATION', label: 'Irrigation', emoji: '💧' },
  { value: 'POWER', label: 'Power', emoji: '⚡' },
];

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    getStats().then(setStats).catch(() => {});
  }, []);

  useEffect(() => {
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value)
    );

    // Don't fetch anything until the person actually applies a filter/search
    if (Object.keys(activeFilters).length === 0) {
      setProjects([]);
      setPagination(null);
      setLoading(false);
      return;
    }

    let ignore = false;
    setLoading(true);

    getProjects({ ...activeFilters, page, limit: 6 })
      .then((data) => {
        if (!ignore) {
          setProjects(data.data);
          setPagination(data.pagination);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [filters, page]);

  const totalProjects = stats
    ? stats.byStatus.reduce((sum, s) => sum + s._count, 0)
    : null;

  const hasActiveFilter = Object.values(filters).some((v) => v);

  function handleCategoryClick(category) {
    setFilters((prev) =>
      prev.category === category ? { ...prev, category: '' } : { ...prev, category }
    );
    setPage(1);
  }

  function handleFilterChange(newFilters) {
    setFilters(newFilters);
    setPage(1);
  }

  return (
    <div>
      {/* HERO */}
      <div style={styles.hero}>
        <div style={styles.blob1} />
        <div style={styles.blob2} />

        <div style={styles.heroInner}>
          <div style={styles.heroText}>
            <div style={styles.heroBadge}>🇮🇳 Public Infrastructure Tracker</div>
            <h1 style={styles.heroTitle}>Paimana</h1>
            <p style={styles.heroSubtitle}>
              A measure of public infrastructure progress — track government
              projects, budgets, and accountability, all in one place.
            </p>

            {stats && (
              <div style={styles.heroStats}>
                <div style={styles.heroStat}>
                  <div style={styles.heroStatValue}>{totalProjects}</div>
                  <div style={styles.heroStatLabel}>Projects Tracked</div>
                </div>
                <div style={styles.heroStatDivider} />
                <div style={styles.heroStat}>
                  <div style={styles.heroStatValue}>
                    ₹{(stats.totalSanctioned / 10000000).toFixed(0)} Cr
                  </div>
                  <div style={styles.heroStatLabel}>Total Sanctioned</div>
                </div>
                <div style={styles.heroStatDivider} />
                <div style={styles.heroStat}>
                  <div style={{ ...styles.heroStatValue, color: '#fca5a5' }}>
                    {stats.delayedCount}
                  </div>
                  <div style={styles.heroStatLabel}>Delayed</div>
                </div>
              </div>
            )}
          </div>

          <div style={styles.heroIllustration}>
            <InfraIllustration />
          </div>
        </div>
      </div>

      {/* CATEGORY QUICK LINKS - overlaps the hero slightly */}
      <div style={styles.categoryStrip}>
        <div style={styles.categoryInner}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategoryClick(cat.value)}
              style={{
                ...styles.categoryPill,
                ...(filters.category === cat.value ? styles.categoryPillActive : {}),
              }}
            >
              <span style={{ fontSize: '18px' }}>{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={styles.content}>
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>All Projects</h2>
            <p style={styles.sectionSubtitle}>
              {loading
                ? 'Loading...'
                : hasActiveFilter
                ? `${projects.length} project${projects.length !== 1 ? 's' : ''} found`
                : `${totalProjects ?? ''} projects available — search or filter to browse`}
            </p>
          </div>
        </div>

        <FilterBar filters={filters} onChange={handleFilterChange} />

        {loading && <p style={styles.status}>Loading projects...</p>}
        {error && <p style={{ ...styles.status, color: '#ef4444' }}>Error: {error}</p>}
        {!loading && !error && projects.length === 0 && hasActiveFilter && (
          <div style={styles.emptyState}>
            <p style={{ margin: 0, fontSize: '32px' }}>🔍</p>
            <p style={styles.status}>No projects match these filters.</p>
          </div>
        )}
        {!loading && !error && projects.length === 0 && !hasActiveFilter && (
          <div style={styles.emptyState}>
            <p style={{ margin: 0, fontSize: '32px' }}>👆</p>
            <p style={styles.status}>
              Search by name, or pick a category / status / state above to browse projects.
            </p>
          </div>
        )}

        <div style={styles.grid}>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {pagination && pagination.totalPages > 1 && (
          <div style={styles.pagination}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{ ...styles.pageBtn, ...(page === 1 ? styles.pageBtnDisabled : {}) }}
            >
              ← Previous
            </button>
            <span style={styles.pageInfo}>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={page === pagination.totalPages}
              style={{
                ...styles.pageBtn,
                ...(page === pagination.totalPages ? styles.pageBtnDisabled : {}),
              }}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function InfraIllustration() {
  return (
    <svg viewBox="0 0 400 300" style={{ width: '100%', maxWidth: '340px' }}>
      <ellipse cx="200" cy="260" rx="180" ry="18" fill="rgba(255,255,255,0.08)" />
      <rect x="40" y="130" width="45" height="110" rx="4" fill="rgba(255,255,255,0.18)" />
      <rect x="95" y="90" width="45" height="150" rx="4" fill="rgba(255,255,255,0.28)" />
      <rect x="150" y="150" width="35" height="90" rx="4" fill="rgba(255,255,255,0.15)" />
      {[0,1,2,3].map(r => (
        <g key={r}>
          <rect x="105" y={105 + r*25} width="10" height="10" fill="rgba(255,255,255,0.5)" />
          <rect x="123" y={105 + r*25} width="10" height="10" fill="rgba(255,255,255,0.5)" />
        </g>
      ))}
      <path d="M190 240 Q 290 140 390 240" stroke="rgba(255,255,255,0.55)" strokeWidth="6" fill="none" />
      <line x1="220" y1="235" x2="220" y2="210" stroke="rgba(255,255,255,0.4)" strokeWidth="4" />
      <line x1="260" y1="220" x2="260" y2="180" stroke="rgba(255,255,255,0.4)" strokeWidth="4" />
      <line x1="300" y1="220" x2="300" y2="180" stroke="rgba(255,255,255,0.4)" strokeWidth="4" />
      <line x1="340" y1="235" x2="340" y2="210" stroke="rgba(255,255,255,0.4)" strokeWidth="4" />
      <rect x="0" y="240" width="400" height="10" fill="rgba(255,255,255,0.2)" />
      <rect x="20" y="244" width="20" height="2" fill="rgba(255,255,255,0.6)" />
      <rect x="60" y="244" width="20" height="2" fill="rgba(255,255,255,0.6)" />
      <rect x="100" y="244" width="20" height="2" fill="rgba(255,255,255,0.6)" />
      <line x1="330" y1="240" x2="330" y2="120" stroke="rgba(255,255,255,0.4)" strokeWidth="4" />
      <line x1="330" y1="125" x2="380" y2="125" stroke="rgba(255,255,255,0.4)" strokeWidth="4" />
      <line x1="330" y1="125" x2="310" y2="135" stroke="rgba(255,255,255,0.4)" strokeWidth="4" />
      <line x1="370" y1="125" x2="370" y2="150" stroke="rgba(255,255,255,0.5)" strokeWidth="3" />
    </svg>
  );
}

const styles = {
  hero: {
    position: 'relative',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 45%, #2563eb 100%)',
    padding: '56px 20px 90px',
  },
  blob1: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(96,165,250,0.35) 0%, transparent 70%)',
    top: '-150px',
    left: '-100px',
  },
  blob2: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(249,115,22,0.25) 0%, transparent 70%)',
    bottom: '-120px',
    right: '5%',
  },
  heroInner: {
    position: 'relative',
    maxWidth: '1100px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '30px',
    flexWrap: 'wrap',
  },
  heroText: {
    flex: '1 1 420px',
    maxWidth: '560px',
  },
  heroIllustration: {
    flex: '1 1 300px',
    display: 'flex',
    justifyContent: 'center',
  },
  heroBadge: {
    display: 'inline-block',
    backgroundColor: 'rgba(255,255,255,0.15)',
    color: '#fff',
    fontSize: '13px',
    fontWeight: 600,
    padding: '6px 14px',
    borderRadius: '20px',
    marginBottom: '18px',
  },
  heroTitle: {
    color: '#fff',
    fontSize: '46px',
    margin: '0 0 12px 0',
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: '16px',
    lineHeight: 1.6,
    margin: '0 0 28px 0',
  },
  heroStats: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap',
  },
  heroStat: {
    textAlign: 'left',
  },
  heroStatValue: {
    color: '#fff',
    fontSize: '26px',
    fontWeight: 800,
  },
  heroStatLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '12px',
    marginTop: '2px',
  },
  heroStatDivider: {
    width: '1px',
    height: '32px',
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  categoryStrip: {
    maxWidth: '1100px',
    margin: '-40px auto 0',
    padding: '0 20px',
    position: 'relative',
  },
  categoryInner: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
    padding: '18px 20px',
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  categoryPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#fff',
    color: '#334155',
    padding: '8px 16px',
    borderRadius: '999px',
    fontSize: '13.5px',
    fontWeight: 600,
  },
  categoryPillActive: {
    backgroundColor: '#eff6ff',
    borderColor: '#2563eb',
    color: '#2563eb',
  },
  content: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '48px 20px 40px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '10px',
  },
  sectionTitle: {
    margin: 0,
    fontSize: '24px',
  },
  sectionSubtitle: {
    margin: '4px 0 0 0',
    color: '#64748b',
    fontSize: '13.5px',
  },
  status: {
    color: '#64748b',
    padding: '20px 0',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 0',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
    marginTop: '16px',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    marginTop: '32px',
  },
  pageBtn: {
    border: '1px solid #e2e8f0',
    backgroundColor: '#fff',
    color: '#334155',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '13.5px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  pageBtnDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
  pageInfo: {
    fontSize: '13.5px',
    color: '#64748b',
  },
};

export default ProjectList;