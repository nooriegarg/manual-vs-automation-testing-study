import { useEffect, useState } from 'react';
import { Package, ShoppingBag, DollarSign, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        setOrders(res.data);
      } catch {
        setError('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div>
      {/* Page header */}
      <div style={styles.hero}>
        <div className="container" style={styles.heroInner}>
          <div style={styles.profileSection}>
            <div style={styles.avatar}>{user?.name?.charAt(0).toUpperCase()}</div>
            <div>
              <h1 style={styles.userName} data-testid="profile-name">{user?.name}</h1>
              <p style={styles.userEmail} data-testid="profile-email">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={styles.body}>
        {/* Stats row */}
        <div style={styles.statsRow}>
          <div className="card" style={styles.statCard}>
            <div style={styles.statIcon('#eef2ff', '#4f46e5')}>
              <ShoppingBag size={20} color="#4f46e5" />
            </div>
            <div>
              <p style={styles.statValue}>{orders.length}</p>
              <p style={styles.statLabel}>Total Orders</p>
            </div>
          </div>
          <div className="card" style={styles.statCard}>
            <div style={styles.statIcon('#f0fdf4', '#16a34a')}>
              <DollarSign size={20} color="#16a34a" />
            </div>
            <div>
              <p style={styles.statValue}>${totalSpent.toFixed(2)}</p>
              <p style={styles.statLabel}>Total Spent</p>
            </div>
          </div>
          <div className="card" style={styles.statCard}>
            <div style={styles.statIcon('#fdf4ff', '#9333ea')}>
              <User size={20} color="#9333ea" />
            </div>
            <div>
              <p style={styles.statValue}>Active</p>
              <p style={styles.statLabel}>Account Status</p>
            </div>
          </div>
        </div>

        {/* Orders section */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 className="section-title"><Package size={18} color="var(--primary)" />Order History</h2>
            <button className="btn-primary" onClick={() => navigate('/products')} style={{ padding: '8px 16px', fontSize: '0.875rem' }}>
              Shop More
            </button>
          </div>

          {loading && (
            <div style={styles.center} data-testid="loading-orders">
              <span className="spinner" />
              <span style={{ color: 'var(--text-3)', marginLeft: 12 }}>Loading orders…</span>
            </div>
          )}
          {error && <p className="error-msg" data-testid="orders-error">{error}</p>}
          {!loading && orders.length === 0 && (
            <div style={styles.emptyState} data-testid="no-orders">
              <span style={{ fontSize: '2.5rem' }}>📦</span>
              <p style={styles.emptyMsg}>No orders yet. Start shopping!</p>
              <button className="btn-primary" style={{ marginTop: 14 }} onClick={() => navigate('/products')}>
                Browse Products
              </button>
            </div>
          )}

          <div style={styles.ordersList} data-testid="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="card" style={styles.orderCard} data-testid={`order-${order._id}`}>
                <div style={styles.orderHeader}>
                  <div>
                    <span style={styles.orderId}>Order #{order._id.slice(-6).toUpperCase()}</span>
                    <span style={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                  <span className="badge badge-success" style={{ padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.78rem' }}>
                    Delivered
                  </span>
                </div>

                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Product</th>
                      <th style={{ ...styles.th, textAlign: 'center' }}>Qty</th>
                      <th style={{ ...styles.th, textAlign: 'right' }}>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, idx) => (
                      <tr key={idx}>
                        <td style={styles.td}>{item.name}</td>
                        <td style={{ ...styles.td, textAlign: 'center' }}>
                          <span style={styles.qtyBadge}>{item.qty}</span>
                        </td>
                        <td style={{ ...styles.td, textAlign: 'right', fontWeight: 600 }}>
                          ${item.price.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div style={styles.orderFooter}>
                  <span style={{ color: 'var(--text-3)', fontSize: '0.875rem' }}>
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </span>
                  <span style={styles.orderTotal} data-testid={`order-total-${order._id}`}>
                    Total: <strong style={{ color: 'var(--primary)' }}>${order.total.toFixed(2)}</strong>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  hero: {
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    padding: '36px 0',
    marginBottom: 0,
  },
  heroInner: {},
  profileSection: { display: 'flex', alignItems: 'center', gap: 20 },
  avatar: {
    width: 64, height: 64, borderRadius: '50%',
    background: 'rgba(255,255,255,0.2)',
    border: '3px solid rgba(255,255,255,0.4)',
    color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.6rem', fontWeight: 800, flexShrink: 0,
  },
  userName: { color: '#fff', fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.3px' },
  userEmail: { color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', marginTop: 4 },
  body: { paddingTop: 32, paddingBottom: 60 },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 16,
    marginBottom: 40,
  },
  statCard: {
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  statIcon: (bg, color) => ({
    width: 44, height: 44,
    borderRadius: 'var(--radius-md)',
    background: bg,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  }),
  statValue: { fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-1)' },
  statLabel: { fontSize: '0.82rem', color: 'var(--text-3)', marginTop: 2 },
  section: {},
  sectionHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 20, flexWrap: 'wrap', gap: 12,
  },
  center: { display: 'flex', alignItems: 'center', padding: '32px 0', color: 'var(--text-3)' },
  emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 0', textAlign: 'center' },
  emptyMsg: { color: 'var(--text-3)', marginTop: 10 },
  ordersList: { display: 'flex', flexDirection: 'column', gap: 20 },
  orderCard: { padding: '20px' },
  orderHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 16, flexWrap: 'wrap', gap: 8,
  },
  orderId: { fontWeight: 700, color: 'var(--primary)', fontSize: '0.95rem', display: 'block' },
  orderDate: { color: 'var(--text-3)', fontSize: '0.82rem', marginTop: 2, display: 'block' },
  table: { width: '100%', borderCollapse: 'collapse', marginBottom: 16 },
  th: {
    padding: '8px 10px', textAlign: 'left',
    fontSize: '0.78rem', color: 'var(--text-3)',
    fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px',
    borderBottom: '1px solid var(--border)',
  },
  td: { padding: '10px', fontSize: '0.9rem', color: 'var(--text-2)', borderBottom: '1px solid var(--surface-3)' },
  qtyBadge: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: 24, height: 24,
    background: 'var(--primary-light)', color: 'var(--primary)',
    borderRadius: '50%', fontSize: '0.78rem', fontWeight: 700,
  },
  orderFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  orderTotal: { fontSize: '0.95rem', color: 'var(--text-2)' },
};
