import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = {
  success: <CheckCircle size={16} />,
  error:   <XCircle size={16} />,
  warning: <AlertTriangle size={16} />,
};

const COLORS = {
  success: { bg: 'var(--success-bg)', border: 'var(--success-border)', color: 'var(--success)' },
  error:   { bg: 'var(--error-bg)',   border: 'var(--error-border)',   color: 'var(--error)'   },
  warning: { bg: 'var(--warning-bg)', border: '#fde68a',               color: 'var(--warning)' },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
  }, []);

  const dismiss = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div style={styles.container} data-testid="toast-container">
        {toasts.map((t) => {
          const c = COLORS[t.type] || COLORS.success;
          return (
            <div
              key={t.id}
              style={{ ...styles.toast, background: c.bg, border: `1px solid ${c.border}`, color: c.color }}
              data-testid={`toast-${t.type}`}
            >
              {ICONS[t.type]}
              <span style={styles.msg}>{t.message}</span>
              <button onClick={() => dismiss(t.id)} style={{ ...styles.close, color: c.color }}>
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

const styles = {
  container: {
    position: 'fixed',
    bottom: 90,
    right: 28,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    zIndex: 400,
    maxWidth: 360,
  },
  toast: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '12px 14px',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-md)',
    fontSize: '0.875rem',
    fontWeight: 500,
    animation: 'slideUp 0.25s ease both',
    minWidth: 260,
  },
  msg: {
    flex: 1,
    lineHeight: 1.4,
  },
  close: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: 2,
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    opacity: 0.7,
  },
};
