import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { token, authReady } = useAuth();

  if (!authReady) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="spinner spinner-lg" />
      </div>
    );
  }

  return token ? children : <Navigate to="/login" replace />;
}
