import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, ArrowLeft, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';
import { useState } from 'react';
import { THUMB_MAP } from '../constants/productData';

export default function Cart() {
  const { items, updateQty, removeItem, clearCart, total } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [placing, setPlacing] = useState(false);

  const handlePlaceOrder = async () => {
    setOrderError('');
    setPlacing(true);
    try {
      await api.post('/orders', {
        items: items.map((i) => ({ productId: i._id, name: i.name, qty: i.qty, price: i.price })),
        total,
      });
      clearCart();
      setOrderSuccess(true);
    } catch (err) {
      const msg = err.response?.data?.message || 'Order failed. Please try again.';
      setOrderError(msg);
      toast(msg, 'error');
    } finally {
      setPlacing(false);
    }
  };

  const handleRemove = (id, name) => {
    removeItem(id);
    toast(`"${name.split(' ').slice(0, 3).join(' ')}…" removed from cart`, 'warning');
  };

  if (orderSuccess) {
    return (
      <div style={styles.successPage}>
        <div className="card" style={styles.successCard}>
          <CheckCircle size={52} color="#16a34a" style={{ marginBottom: 16 }} />
          <h2 style={styles.successTitle}>Order Placed!</h2>
          <p style={styles.successMsg}>Thank you, <strong>{user?.name}</strong>. We've received your order.</p>
          <div style={styles.successActions}>
            <button className="btn-primary" onClick={() => navigate('/dashboard')} data-testid="btn-view-orders">
              View Orders
            </button>
            <button className="btn-secondary" onClick={() => navigate('/products')}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={styles.header}>
        <div className="container" style={styles.headerInner}>
          <button className="btn-ghost" onClick={() => navigate('/products')} style={{ padding: '8px 14px' }}>
            <ArrowLeft size={15} /> Back to Products
          </button>
          <div style={styles.headerTitle}>
            <ShoppingCart size={20} color="var(--primary)" />
            <h1 style={styles.title}>Shopping Cart</h1>
            {items.length > 0 && (
              <span className="badge badge-primary">{items.length} item{items.length !== 1 ? 's' : ''}</span>
            )}
          </div>
        </div>
      </div>

      <div className="container" style={styles.page}>
        {items.length === 0 ? (
          <div style={styles.emptyState} data-testid="empty-cart">
            <span style={{ fontSize: '3rem' }}>🛒</span>
            <h3 style={styles.emptyTitle}>Your cart is empty</h3>
            <p style={styles.emptyMsg}>Add some products to get started!</p>
            <button className="btn-primary" style={{ marginTop: 20 }} onClick={() => navigate('/products')}>
              Browse Products
            </button>
          </div>
        ) : (
          <div className="cart-layout" data-testid="cart-layout">
            {/* Items list */}
            <div style={styles.itemsList} data-testid="cart-items">
              {items.map((item) => (
                <div key={item._id} className="card" style={styles.itemCard} data-testid={`cart-item-${item._id}`}>
                  <img
                    src={THUMB_MAP[item.name] || `https://picsum.photos/seed/${item._id}/80/80`}
                    alt={item.name}
                    style={styles.itemImg}
                  />
                  <div style={styles.itemBody}>
                    <p style={styles.itemName}>{item.name}</p>
                    <p style={styles.itemPrice}>${item.price.toFixed(2)} each</p>
                    <p style={styles.itemSubtotal}>
                      Subtotal: <strong style={{ color: 'var(--primary)' }}>${(item.price * item.qty).toFixed(2)}</strong>
                    </p>
                  </div>
                  {/* BUG-04 intentional: flex-wrap missing on mobile <480px — qty controls overflow on narrow viewports.
                      This is a preserved responsive UI defect for testing research. */}
                  <div style={styles.itemControls}>
                    <div style={styles.qtyRow}>
                      <button
                        className="btn-secondary"
                        style={styles.qtyBtn}
                        onClick={() => updateQty(item._id, item.qty - 1)}
                        data-testid={`btn-decrease-${item._id}`}
                      >−</button>
                      <span style={styles.qtyNum} data-testid={`qty-${item._id}`}>{item.qty}</span>
                      <button
                        className="btn-secondary"
                        style={styles.qtyBtn}
                        onClick={() => updateQty(item._id, item.qty + 1)}
                        data-testid={`btn-increase-${item._id}`}
                      >+</button>
                    </div>
                    <button
                      className="btn-danger"
                      onClick={() => handleRemove(item._id, item.name)}
                      data-testid={`btn-remove-${item._id}`}
                      style={{ padding: '7px 10px', borderRadius: 'var(--radius-md)' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order summary */}
            <div className="card cart-summary" style={styles.summary}>
              <h3 style={styles.summaryTitle}>Order Summary</h3>
              <hr className="divider" />

              {items.map((item) => (
                <div key={item._id} style={styles.summaryRow}>
                  <span style={styles.summaryItemName}>{item.name.split(' ').slice(0, 3).join(' ')}…</span>
                  <span>${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}

              <hr className="divider" />

              <div style={styles.summaryRow}>
                <span>Subtotal</span>
                <span data-testid="cart-total">${total.toFixed(2)}</span>
              </div>
              <div style={styles.summaryRow}>
                <span>Shipping</span>
                <span style={{ color: 'var(--success)', fontWeight: 600 }}>Free</span>
              </div>
              <hr className="divider" />
              <div style={{ ...styles.summaryRow, fontWeight: 800, fontSize: '1.1rem' }}>
                <span>Total</span>
                <span style={{ color: 'var(--primary)' }}>${total.toFixed(2)}</span>
              </div>

              {orderError && <p className="error-msg" style={{ marginTop: 14 }} data-testid="order-error">{orderError}</p>}

              <button
                className="btn-primary"
                style={{ width: '100%', padding: '13px', marginTop: 18, fontSize: '0.97rem' }}
                onClick={handlePlaceOrder}
                disabled={placing}
                data-testid="btn-place-order"
              >
                {placing ? <span className="spinner" /> : <><ShoppingCart size={16} /> Place Order</>}
              </button>

              <p style={styles.secureNote}>🔒 Secure checkout</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  header: {
    background: 'var(--surface)',
    borderBottom: '1px solid var(--border)',
    padding: '16px 0',
    marginBottom: 32,
  },
  headerInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  headerTitle: { display: 'flex', alignItems: 'center', gap: 10 },
  title: { fontSize: '1.3rem', fontWeight: 800 },
  page: { paddingBottom: 60 },
  emptyState: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '80px 20px', textAlign: 'center',
  },
  emptyTitle: { fontSize: '1.3rem', fontWeight: 700, marginTop: 16, color: 'var(--text-1)' },
  emptyMsg: { color: 'var(--text-3)', marginTop: 8 },
  itemsList: { display: 'flex', flexDirection: 'column', gap: 16 },
  itemCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: 16,
  },
  itemImg: {
    width: 72, height: 72,
    borderRadius: 'var(--radius-md)',
    objectFit: 'cover',
    flexShrink: 0,
    border: '1px solid var(--border)',
  },
  itemBody: { flex: 1, minWidth: 0 },
  itemName: { fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-1)', marginBottom: 4 },
  itemPrice: { color: 'var(--text-3)', fontSize: '0.85rem', marginBottom: 4 },
  itemSubtotal: { fontSize: '0.85rem', color: 'var(--text-2)' },
  itemControls: { display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 },
  qtyRow: { display: 'flex', alignItems: 'center', gap: 6 },
  qtyBtn: { width: 32, height: 32, padding: 0, fontWeight: 700, fontSize: '1rem' },
  qtyNum: { minWidth: 28, textAlign: 'center', fontWeight: 700, fontSize: '1rem' },
  summary: { padding: 24, position: 'sticky', top: 80 },
  summaryTitle: { fontWeight: 800, fontSize: '1.1rem', marginBottom: 4 },
  summaryRow: {
    display: 'flex', justifyContent: 'space-between',
    fontSize: '0.9rem', marginBottom: 10, color: 'var(--text-2)',
  },
  summaryItemName: { color: 'var(--text-3)', fontSize: '0.85rem', maxWidth: '60%', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' },
  secureNote: { textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-4)', marginTop: 12 },
  successPage: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
  successCard: { maxWidth: 440, width: '100%', padding: '48px 40px', textAlign: 'center' },
  successTitle: { fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-1)', marginBottom: 10 },
  successMsg: { color: 'var(--text-3)', marginBottom: 28 },
  successActions: { display: 'flex', flexDirection: 'column', gap: 12 },
};
