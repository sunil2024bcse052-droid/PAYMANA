import { Link } from 'react-router-dom';
import logo from '../assets/logopaimana.png';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <div style={styles.blob} />

      <div style={styles.inner}>
        <div style={styles.brandCol}>
          <div style={styles.logoWrap}>
            <img src={logo} alt="Paimana" style={styles.footerLogo} />
          </div>
          <p style={styles.tagline}>
            Paimana (पैमाना — "measure" in Hindi) is a public infrastructure
            transparency tracker. It follows government projects — rail lines,
            metros, bridges, roads, and buildings — from sanction to completion,
            showing budgets, timelines, and a verified accountability trail so
            citizens can see exactly what's happening with public money.
          </p>
          <div style={styles.updatedPill}>
            Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        <div style={styles.col}>
          <h4 style={styles.colTitle}>Explore</h4>
          <Link to="/" style={styles.link}>All Projects</Link>
          <Link to="/dashboard" style={styles.link}>Dashboard</Link>
          <Link to="/login" style={styles.link}>Login</Link>
        </div>

        <div style={styles.col}>
          <h4 style={styles.colTitle}>Categories</h4>
          <span style={styles.link}>Rail &amp; Metro</span>
          <span style={styles.link}>Roads &amp; Bridges</span>
          <span style={styles.link}>Buildings</span>
        </div>

        <div style={styles.col}>
          <h4 style={styles.colTitle}>How it works</h4>
          <p style={styles.aboutText}>
            A government employee registers a project and its budget. A
            contractor submits progress updates as work happens. Nothing goes
            public until an employee reviews and approves it — every approved
            change is logged, so the full history stays visible.
          </p>
          <p style={{ ...styles.aboutText, marginTop: '10px', color: '#64748b' }}>
            This is a practice project built to demonstrate a full-stack
            accountability workflow. Project data shown is manually curated for
            demonstration purposes, not live government data.
          </p>
        </div>
      </div>

      <div style={styles.bottomBar}>
        <span>© {year} Paimana. Built as a full-stack learning project.</span>
        <span style={styles.bottomLinks}>
          <a href="https://github.com" target="_blank" rel="noreferrer" style={styles.bottomLink}>GitHub</a>
        </span>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#0f172a',
    marginTop: '60px',
    paddingTop: '48px',
  },
  blob: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(94,234,212,0.08) 0%, transparent 70%)',
    top: '-150px',
    right: '-100px',
  },
  inner: {
    position: 'relative',
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '0 28px',
    display: 'grid',
    gridTemplateColumns: '1.6fr 0.8fr 0.8fr 1.4fr',
    gap: '32px',
  },
  brandCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  logoWrap: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '10px 16px',
    width: 'fit-content',
  },
  footerLogo: {
    height: '44px',
    width: 'auto',
    display: 'block',
  },
  tagline: {
    color: '#94a3b8',
    fontSize: '13px',
    lineHeight: 1.6,
    margin: 0,
    maxWidth: '340px',
  },
  updatedPill: {
    display: 'inline-block',
    backgroundColor: 'rgba(255,255,255,0.08)',
    color: '#cbd5e1',
    fontSize: '12px',
    padding: '6px 12px',
    borderRadius: '20px',
    width: 'fit-content',
  },
  col: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  colTitle: {
    color: '#fff',
    fontSize: '14px',
    margin: '0 0 4px 0',
  },
  link: {
    color: '#94a3b8',
    fontSize: '13px',
    textDecoration: 'none',
  },
  aboutText: {
    color: '#94a3b8',
    fontSize: '12.5px',
    lineHeight: 1.6,
    margin: 0,
  },
  bottomBar: {
    position: 'relative',
    marginTop: '40px',
    borderTop: '1px solid #1e293b',
    padding: '18px 28px',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '10px',
    fontSize: '12.5px',
    color: '#64748b',
  },
  bottomLinks: {
    display: 'flex',
    gap: '16px',
  },
  bottomLink: {
    color: '#64748b',
    textDecoration: 'none',
  },
};

export default Footer;