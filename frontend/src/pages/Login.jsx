import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Store, ArrowRight } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.user, res.data.token);
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Left hero panel */}
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.heroLogo}>
            <Store size={28} color="#fff" />
          </div>
          <h1 style={styles.heroTitle}>ShopLab</h1>
          <p style={styles.heroSub}>Your modern shopping experience</p>
          <div style={styles.heroFeatures}>
            {['8 curated products', 'AI-powered assistant', 'Instant checkout'].map((f) => (
              <div key={f} style={styles.heroFeatureItem}>
                <span style={styles.heroDot} />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div style={styles.formSide}>
        <div style={styles.formBox} className="page-enter">
          <h2 style={styles.title}>Welcome back</h2>
          <p style={styles.subtitle}>Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} data-testid="login-form" style={{ marginTop: 28 }}>
            <div style={styles.field}>
              <label style={styles.label}>Email address</label>
              <div className="input-wrapper">
                <Mail size={16} className="input-icon" />
                <input
                  type="text"
                  name="email"
                  id="email"
                  data-testid="input-email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <div className="input-wrapper">
                <Lock size={16} className="input-icon" />
                <input
                  type="password"
                  name="password"
                  id="password"
                  data-testid="input-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && <p className="error-msg" style={{ marginBottom: 16 }} data-testid="login-error">{error}</p>}

            <button
              type="submit"
              className="btn-primary"
              data-testid="btn-login"
              style={{ width: '100%', padding: '13px', fontSize: '0.97rem', marginTop: 4 }}
              disabled={loading}
            >
              {loading ? <span className="spinner" /> : <><span>Sign In</span><ArrowRight size={16} /></>}
            </button>
          </form>

          <p style={styles.footer}>
            Don&apos;t have an account?{' '}
            <Link to="/register" style={styles.footerLink} data-testid="link-register">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: 'flex',
    minHeight: '100vh',
  },
  hero: {
    flex: '0 0 42%',
    background: 'linear-gradient(145deg, #4f46e5 0%, #7c3aed 60%, #6d28d9 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 48px',
  },
  heroContent: {
    color: '#fff',
  },
  heroLogo: {
    width: 60, height: 60,
    borderRadius: 16,
    background: 'rgba(255,255,255,0.15)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: '2.4rem',
    fontWeight: 800,
    letterSpacing: '-0.5px',
    marginBottom: 10,
  },
  heroSub: {
    fontSize: '1.05rem',
    opacity: 0.8,
    marginBottom: 36,
    lineHeight: 1.5,
  },
  heroFeatures: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  heroFeatureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    fontSize: '0.95rem',
    opacity: 0.9,
  },
  heroDot: {
    width: 8, height: 8,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.6)',
    flexShrink: 0,
  },
  formSide: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 24px',
    background: 'var(--surface-2)',
  },
  formBox: {
    width: '100%',
    maxWidth: 400,
    background: 'var(--surface)',
    borderRadius: 'var(--radius-xl)',
    padding: '40px 36px',
    boxShadow: 'var(--shadow-xl)',
    border: '1px solid var(--border)',
  },
  title: {
    fontSize: '1.6rem',
    fontWeight: 800,
    color: 'var(--text-1)',
    letterSpacing: '-0.4px',
  },
  subtitle: {
    color: 'var(--text-3)',
    fontSize: '0.93rem',
    marginTop: 6,
  },
  field: { marginBottom: 18 },
  label: {
    display: 'block',
    marginBottom: 7,
    fontWeight: 600,
    fontSize: '0.875rem',
    color: 'var(--text-2)',
  },
  footer: {
    marginTop: 24,
    textAlign: 'center',
    color: 'var(--text-3)',
    fontSize: '0.9rem',
  },
  footerLink: {
    color: 'var(--primary)',
    fontWeight: 700,
  },
};
