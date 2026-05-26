import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={styles.page}>
      <p style={styles.code}>404</p>
      <h2 style={styles.title}>Page not found</h2>
      <p style={styles.msg}>The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/products">
        <button className="btn-primary" data-testid="btn-go-home" style={{ padding: '11px 24px' }}>
          <Home size={16} /> Back to Products
        </button>
      </Link>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '80vh',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    gap: 12, padding: 24, textAlign: 'center',
  },
  code: {
    fontSize: '7rem', fontWeight: 900,
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    lineHeight: 1,
  },
  title: { fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-1)', marginTop: 8 },
  msg: { color: 'var(--text-3)', maxWidth: 360, marginBottom: 12 },
};
