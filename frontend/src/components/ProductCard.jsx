import { ShoppingCart, Star } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { CARD_MAP, RATING_MAP } from '../constants/productData';

function StarRating({ rating }) {
  return (
    <div className="stars" style={{ gap: 3 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={13}
          fill={i <= Math.round(rating) ? '#f59e0b' : 'none'}
          color={i <= Math.round(rating) ? '#f59e0b' : '#cbd5e1'}
          strokeWidth={1.5}
        />
      ))}
      <span style={{ fontSize: '0.78rem', color: 'var(--text-3)', marginLeft: 4, fontWeight: 500 }}>
        {rating}
      </span>
    </div>
  );
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);

  const imgSrc = CARD_MAP[product.name] || `https://picsum.photos/seed/${product._id}/400/280`;
  const rating = RATING_MAP[product.name] || 4.2;
  const isLowStock = product.stock > 0 && product.stock < 5;
  const outOfStock = product.stock === 0;

  const handleAdd = () => {
    if (!user) { navigate('/login'); return; }
    addToCart(product);
    setAdded(true);
    toast(`"${product.name}" added to cart`, 'success');
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div
      className="card"
      style={{
        ...styles.card,
        transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
        boxShadow: hovered ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/products/${product._id}`)}
      data-testid={`product-card-${product._id}`}
    >
      {/* Image */}
      <div style={styles.imgWrap}>
        <img
          src={imgSrc}
          alt={product.name}
          style={{ ...styles.img, transform: hovered ? 'scale(1.04)' : 'scale(1)' }}
          data-testid={`product-img-${product._id}`}
        />
        <span style={styles.categoryBadge}>{product.category}</span>
        {isLowStock && <span style={styles.lowStockBadge}>Only {product.stock} left</span>}
        {outOfStock && <span style={styles.outOfStockBadge}>Out of Stock</span>}
      </div>

      {/* Body */}
      <div style={styles.body}>
        <StarRating rating={rating} />

        <h3 style={styles.name} data-testid={`product-name-${product._id}`}>
          {product.name}
        </h3>
        <p style={styles.description}>{product.description}</p>

        {/* Stock indicator */}
        <div style={styles.stockRow}>
          <span style={{ ...styles.stockDot, background: outOfStock ? '#ef4444' : isLowStock ? '#f59e0b' : '#22c55e' }} />
          <span style={styles.stockText}>
            {outOfStock ? 'Out of stock' : isLowStock ? 'Low stock' : 'In stock'}
          </span>
        </div>

        {/* Price + CTA */}
        <div style={styles.footer}>
          <div>
            <span style={styles.price} data-testid={`product-price-${product._id}`}>
              ${product.price.toFixed(2)}
            </span>
            <span style={styles.priceOriginal}>
              ${(product.price * 1.15).toFixed(2)}
            </span>
          </div>
          <button
            className="btn-primary"
            style={{ padding: '8px 14px', fontSize: '0.83rem' }}
            onClick={(e) => { e.stopPropagation(); handleAdd(); }}
            disabled={outOfStock}
            data-testid={`btn-add-to-cart-${product._id}`}
          >
            {added ? (
              <span style={{ color: '#fff' }}>✓ Added</span>
            ) : (
              <><ShoppingCart size={14} /> Add</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    padding: 0,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.22s ease, box-shadow 0.22s ease',
    cursor: 'pointer',
  },
  imgWrap: {
    position: 'relative',
    overflow: 'hidden',
    height: 200,
    background: 'var(--surface-3)',
  },
  img: {
    width: '100%', height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.35s ease',
  },
  categoryBadge: {
    position: 'absolute', top: 10, left: 10,
    background: 'rgba(79,70,229,0.9)',
    backdropFilter: 'blur(4px)',
    color: '#fff',
    fontSize: '0.7rem', fontWeight: 700,
    padding: '3px 9px',
    borderRadius: 'var(--radius-full)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  lowStockBadge: {
    position: 'absolute', top: 10, right: 10,
    background: 'rgba(245,158,11,0.92)',
    color: '#fff',
    fontSize: '0.68rem', fontWeight: 700,
    padding: '3px 8px',
    borderRadius: 'var(--radius-full)',
  },
  outOfStockBadge: {
    position: 'absolute', top: 10, right: 10,
    background: 'rgba(239,68,68,0.92)',
    color: '#fff',
    fontSize: '0.68rem', fontWeight: 700,
    padding: '3px 8px',
    borderRadius: 'var(--radius-full)',
  },
  body: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1,
  },
  name: {
    fontSize: '0.95rem',
    fontWeight: 700,
    lineHeight: 1.35,
    color: 'var(--text-1)',
  },
  description: {
    fontSize: '0.82rem',
    color: 'var(--text-3)',
    lineHeight: 1.5,
    flex: 1,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  stockRow: { display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 },
  stockDot: { width: 7, height: 7, borderRadius: '50%', flexShrink: 0 },
  stockText: { fontSize: '0.78rem', color: 'var(--text-3)', fontWeight: 500 },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '4px',
    gap: 8,
  },
  price: { fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-1)' },
  priceOriginal: {
    fontSize: '0.8rem', color: 'var(--text-4)',
    textDecoration: 'line-through', marginLeft: '6px',
  },
};
