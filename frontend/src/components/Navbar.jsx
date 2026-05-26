import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingCart, LayoutDashboard, LogIn, UserPlus, LogOut,
  Store, MessageCircle, Search,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useChat } from '../context/ChatContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const { toggle: toggleChat, isOpen: chatOpen } = useChat();
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = items.reduce((sum, i) => sum + i.qty, 0);

  const handleLogout = () => { logout(); navigate('/login'); };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.nav} data-testid="navbar">
      <div className="container" style={styles.inner}>

        {/* Logo */}
        <Link to="/products" style={styles.logo} data-testid="nav-logo">
          <div style={styles.logoIcon}><Store size={18} color="#fff" /></div>
          <span style={styles.logoText}>ShopLab</span>
        </Link>

        {/* Nav links */}
        <div style={styles.links}>
          <Link
            to="/products"
            style={{ ...styles.link, ...(isActive('/products') ? styles.linkActive : {}) }}
            data-testid="nav-products"
          >
            <Search size={15} />
            Products
          </Link>

          {user ? (
            <>
              <button
                onClick={toggleChat}
                style={{ ...styles.iconBtn, ...(chatOpen ? styles.iconBtnActive : {}) }}
                data-testid="nav-chatbot"
                title="AI Assistant"
              >
                <MessageCircle size={18} />
              </button>

              <Link
                to="/cart"
                style={{ ...styles.iconBtn, textDecoration: 'none', position: 'relative', ...(isActive('/cart') ? styles.iconBtnActive : {}) }}
                data-testid="nav-cart"
                title="Cart"
              >
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span style={styles.cartBadge} data-testid="cart-badge">{cartCount}</span>
                )}
              </Link>

              <Link
                to="/dashboard"
                style={{ ...styles.iconBtn, textDecoration: 'none', ...(isActive('/dashboard') ? styles.iconBtnActive : {}) }}
                data-testid="nav-dashboard"
                title="Dashboard"
              >
                <LayoutDashboard size={18} />
              </Link>

              {/* User avatar */}
              <div style={styles.userChip} data-testid="nav-user">
                <div style={styles.avatar}>{user.name.charAt(0).toUpperCase()}</div>
                <span style={styles.userName}>{user.name.split(' ')[0]}</span>
              </div>

              <button
                onClick={handleLogout}
                className="btn-ghost"
                style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                data-testid="btn-logout"
              >
                <LogOut size={15} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link} data-testid="nav-login">
                <LogIn size={15} />
                Login
              </Link>
              <Link to="/register" data-testid="nav-register">
                <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>
                  <UserPlus size={15} />
                  Register
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--border)',
    position: 'sticky',
    top: 0,
    zIndex: 200,
    boxShadow: '0 1px 12px rgba(0,0,0,0.06)',
    height: 'var(--nav-h)',
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
  },
  logoIcon: {
    width: 34, height: 34,
    borderRadius: 'var(--radius-md)',
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: 'var(--shadow-primary)',
  },
  logoText: {
    fontWeight: 800,
    fontSize: '1.2rem',
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.4px',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  link: {
    color: 'var(--text-2)',
    fontWeight: 500,
    fontSize: '0.9rem',
    padding: '8px 12px',
    borderRadius: 'var(--radius-md)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.15s',
  },
  linkActive: {
    color: 'var(--primary)',
    background: 'var(--primary-light)',
  },
  iconBtn: {
    background: 'transparent',
    color: 'var(--text-3)',
    border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '8px 10px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.15s',
    position: 'relative',
  },
  iconBtnActive: {
    color: 'var(--primary)',
    background: 'var(--primary-light)',
    borderColor: 'var(--primary-muted)',
  },
  cartBadge: {
    position: 'absolute',
    top: '-7px', right: '-7px',
    background: '#ef4444',
    color: '#fff',
    borderRadius: 'var(--radius-full)',
    minWidth: '18px', height: '18px',
    padding: '0 5px',
    fontSize: '0.7rem',
    fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    border: '2px solid #fff',
  },
  userChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '5px 10px 5px 6px',
    borderRadius: 'var(--radius-full)',
    background: 'var(--surface-3)',
    border: '1px solid var(--border)',
  },
  avatar: {
    width: 28, height: 28,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.75rem', fontWeight: 700,
    flexShrink: 0,
  },
  userName: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: 'var(--text-2)',
  },
};
