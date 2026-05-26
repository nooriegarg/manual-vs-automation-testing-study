import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, Package } from 'lucide-react';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
 
const IMAGE_MAP = {
  'Wireless Noise-Cancelling Headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=420&fit=crop&auto=format',
  'Mechanical Keyboard':                  'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=600&h=420&fit=crop&auto=format',
  'USB-C Hub 7-in-1':                    'https://images.unsplash.com/photo-1625948515954-df0f5cf77e81?w=600&h=420&fit=crop&auto=format',
  'Classic Fit Cotton T-Shirt':           'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=420&fit=crop&auto=format',
  'Slim Fit Chino Pants':                 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=420&fit=crop&auto=format',
  'Lightweight Running Jacket':           'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&h=420&fit=crop&auto=format',
  'Clean Code by Robert C. Martin':       'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=420&fit=crop&auto=format',
  'The Pragmatic Programmer':             'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&h=420&fit=crop&auto=format',
};
 
const RATING_MAP = {
  'Wireless Noise-Cancelling Headphones': 4.5,
  'Mechanical Keyboard': 4.3,
  'USB-C Hub 7-in-1': 4.1,
  'Classic Fit Cotton T-Shirt': 4.6,
  'Slim Fit Chino Pants': 4.2,
  'Lightweight Running Jacket': 4.4,
  'Clean Code by Robert C. Martin': 4.9,
  'The Pragmatic Programmer': 4.8,
};
 
function StarRating({ rating }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={16}
          fill={i <= Math.round(rating) ? '#f59e0b' : 'none'}
          color={i <= Math.round(rating) ? '#f59e0b' : '#cbd5e1'}
          strokeWidth={1.5}
        />
      ))}
      <span style={{ fontSize: '0.9rem', color: 'var(--text-3)', marginLeft: 6, fontWeight: 600 }}>
        {rating} / 5
      </span>
    </div>
  );
}
 
export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);
 
  useEffect(() => {
    setLoading(true);
    api.get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => setError('Product not found.'))
      .finally(() => setLoading(false));
  }, [id]);
 
  const handleAdd = () => {
    if (!user) { navigate('/login'); return; }
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };
 
  if (loading) {
    return (
      <div style={styles.center}>
        <span className="spinner spinner-lg" />
        <p style={{ color: 'var(--text-3)', marginTop: 12 }}>Loading product...</p>
      </div>
    );
  }
 
  if (error || !product) {
    return (
      <div style={styles.center}>
        <span style={{ fontSize: '2.5rem' }}>😕</span>
        <p style={{ color: 'var(--text-3)', marginTop: 12 }}>{error || 'Product not found.'}</p>
        <button className="btn-secondary" style={{ marginTop: 20 }} onClick={() => navigate('/products')}>
          Back to Products
        </button>
      </div>
    );
  }
 
  const imgSrc = IMAGE_MAP[product.name] || `https://picsum.photos/seed/${product._id}/600/420`;
  const rating = RATING_MAP[product.name] || 4.2;
  const isLowStock = product.stock > 0 && product.stock < 5;
  const outOfStock = product.stock === 0;
 
  return (
    <div>
      {/* Top bar */}
      <div style={styles.topBar}>
        <div className="container" style={styles.topBarInner}>
          <button className="btn-ghost" onClick={() => navigate('/products')} style={{ padding: '8px 14px' }}>
            <ArrowLeft size={15} /> Back to Products
          </button>
          <span style={styles.breadcrumb}>
            Products / <strong>{product.category}</strong> / {product.name}
          </span>
        </div>
      </div>
 
      <div className="container" style={styles.page}>
        <div style={styles.layout}>
          {/* Image */}
          <div style={styles.imgWrap}>
            <img src={imgSrc} alt={product.name} style={styles.img} data-testid="detail-img" />
            <span style={styles.categoryBadge}>{product.category}</span>
            {isLowStock && <span style={styles.lowStockBadge}>Only {product.stock} left</span>}
            {outOfStock && <span style={styles.outOfStockBadge}>Out of Stock</span>}
          </div>
 
          {/* Info panel */}
          <div style={styles.info}>
            <StarRating rating={rating} />
 
            <h1 style={styles.name} data-testid="detail-name">{product.name}</h1>
 
            <div style={styles.priceRow}>
              <span style={styles.price} data-testid="detail-price">${product.price.toFixed(2)}</span>
              <span style={styles.priceOriginal}>${(product.price * 1.15).toFixed(2)}</span>
              <span style={styles.discount}>13% off</span>
            </div>
 
            <p style={styles.description}>{product.description}</p>
 
            <div style={styles.stockRow}>
              <Package size={15} color="var(--text-3)" />
              <span style={{
                ...styles.stockText,
                color: outOfStock ? '#ef4444' : isLowStock ? '#f59e0b' : '#16a34a',
                fontWeight: 600,
              }}>
                {outOfStock ? 'Out of stock' : isLowStock ? `Only ${product.stock} units left` : `${product.stock} in stock`}
              </span>
            </div>
 
            <hr className="divider" />
 
            <div style={styles.actions}>
              <button
                className="btn-primary"
                style={{ padding: '12px 28px', fontSize: '1rem', flex: 1 }}
                onClick={handleAdd}
                disabled={outOfStock}
                data-testid="detail-add-to-cart"
              >
                {added ? '✓ Added to Cart' : <><ShoppingCart size={16} /> Add to Cart</>}
              </button>
              <button
                className="btn-secondary"
                style={{ padding: '12px 20px' }}
                onClick={() => navigate('/cart')}
              >
                View Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
 
const styles = {
  topBar: {
    background: 'var(--surface)',
    borderBottom: '1px solid var(--border)',
    padding: '14px 0',
    marginBottom: 36,
  },
  topBarInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  breadcrumb: {
    fontSize: '0.85rem',
    color: 'var(--text-3)',
  },
  page: { paddingBottom: 60 },
  center: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', padding: '80px 20px', textAlign: 'center',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 48,
    alignItems: 'start',
  },
  imgWrap: {
    position: 'relative',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    background: 'var(--surface-3)',
    aspectRatio: '4/3',
  },
  img: {
    width: '100%', height: '100%',
    objectFit: 'cover',
  },
  categoryBadge: {
    position: 'absolute', top: 14, left: 14,
    background: 'rgba(79,70,229,0.9)',
    backdropFilter: 'blur(4px)',
    color: '#fff',
    fontSize: '0.72rem', fontWeight: 700,
    padding: '4px 12px',
    borderRadius: 'var(--radius-full)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  lowStockBadge: {
    position: 'absolute', top: 14, right: 14,
    background: 'rgba(245,158,11,0.92)',
    color: '#fff',
    fontSize: '0.72rem', fontWeight: 700,
    padding: '4px 10px',
    borderRadius: 'var(--radius-full)',
  },
  outOfStockBadge: {
    position: 'absolute', top: 14, right: 14,
    background: 'rgba(239,68,68,0.92)',
    color: '#fff',
    fontSize: '0.72rem', fontWeight: 700,
    padding: '4px 10px',
    borderRadius: 'var(--radius-full)',
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  name: {
    fontSize: '1.75rem',
    fontWeight: 800,
    lineHeight: 1.25,
    color: 'var(--text-1)',
    marginTop: 4,
  },
  priceRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 10,
    flexWrap: 'wrap',
  },
  price: {
    fontWeight: 800,
    fontSize: '2rem',
    color: 'var(--text-1)',
  },
  priceOriginal: {
    fontSize: '1rem',
    color: 'var(--text-4)',
    textDecoration: 'line-through',
  },
  discount: {
    background: '#dcfce7',
    color: '#16a34a',
    fontSize: '0.78rem',
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: 'var(--radius-full)',
  },
  description: {
    fontSize: '0.95rem',
    color: 'var(--text-2)',
    lineHeight: 1.7,
  },
  stockRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  stockText: {
    fontSize: '0.9rem',
  },
  actions: {
    display: 'flex',
    gap: 12,
    marginTop: 4,
  },
};