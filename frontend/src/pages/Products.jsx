import { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, Package } from 'lucide-react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Books'];

const CATEGORY_ICONS = { Electronics: '⚡', Clothing: '👕', Books: '📚', All: '🛍️' };

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      const res = await api.get('/products', { params });
      setProducts(res.data);
    } catch {
      setError('Failed to load products. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [search, category]);

  return (
    <div>
      {/* Hero banner */}
      <div style={styles.hero}>
        <div className="container">
          <div style={styles.heroInner}>
            <div>
              <h1 style={styles.heroTitle}>Discover Products</h1>
              <p style={styles.heroSub}>Electronics, Clothing & Books — all in one place</p>
            </div>
            {/* Search bar in hero */}
            <div style={styles.heroSearch}>
              <Search size={18} style={{ color: 'var(--text-4)', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-testid="search-input"
                style={styles.heroSearchInput}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={styles.body}>
        {/* Category pills + result count */}
        <div style={styles.toolbar} data-testid="toolbar">
          <div style={styles.pills}>
            <SlidersHorizontal size={15} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                data-testid={`category-${c}`}
                style={{
                  ...styles.pill,
                  ...(category === c ? styles.pillActive : {}),
                }}
              >
                <span>{CATEGORY_ICONS[c]}</span>
                {c}
              </button>
            ))}
          </div>
          {!loading && (
            <span style={styles.count} data-testid="product-count">
              <Package size={14} />
              {products.length} product{products.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* States */}
        {loading && (
          <div style={styles.center} data-testid="loading-products">
            <span className="spinner spinner-lg" />
            <p style={styles.loadingText}>Loading products...</p>
          </div>
        )}
        {error && <p className="error-msg" data-testid="products-error">{error}</p>}
        {!loading && !error && products.length === 0 && (
          <div style={styles.center} data-testid="no-products">
            <span style={styles.emptyIcon}>🔍</span>
            <p style={{ color: 'var(--text-3)', marginTop: 12 }}>No products found for <strong>"{search}"</strong></p>
          </div>
        )}

        {/* Grid */}
        <div style={styles.grid} data-testid="product-grid">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  hero: {
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    padding: '40px 0 36px',
    marginBottom: 0,
  },
  heroInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 24,
    flexWrap: 'wrap',
  },
  heroTitle: {
    color: '#fff',
    fontSize: '1.9rem',
    fontWeight: 800,
    letterSpacing: '-0.4px',
  },
  heroSub: {
    color: 'rgba(255,255,255,0.75)',
    marginTop: 4,
    fontSize: '0.95rem',
  },
  heroSearch: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: 'rgba(255,255,255,0.95)',
    borderRadius: 'var(--radius-full)',
    padding: '10px 20px',
    minWidth: 280,
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
  },
  heroSearchInput: {
    border: 'none',
    background: 'transparent',
    outline: 'none',
    fontSize: '0.95rem',
    flex: 1,
    padding: 0,
    width: '100%',
  },
  body: {
    paddingTop: 28,
    paddingBottom: 60,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
    flexWrap: 'wrap',
    gap: 12,
  },
  pills: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  pill: {
    padding: '7px 16px',
    borderRadius: 'var(--radius-full)',
    background: 'var(--surface)',
    border: '1.5px solid var(--border)',
    color: 'var(--text-2)',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    transition: 'all 0.15s',
  },
  pillActive: {
    background: 'var(--primary)',
    color: '#fff',
    border: '1.5px solid var(--primary)',
    boxShadow: 'var(--shadow-primary)',
  },
  count: {
    fontSize: '0.875rem',
    color: 'var(--text-3)',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontWeight: 500,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: 24,
  },
  center: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 0',
    gap: 8,
  },
  loadingText: { color: 'var(--text-3)', marginTop: 12, fontSize: '0.95rem' },
  emptyIcon: { fontSize: '2.5rem' },
};
