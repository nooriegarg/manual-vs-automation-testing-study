import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useChat } from './context/ChatContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import ChatBot from './components/ChatBot';

export default function App() {
  const { isOpen } = useChat();

  return (
    <BrowserRouter>
      <div className={`app-layout${isOpen ? ' panel-open' : ''}`}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <ChatBot />
    </BrowserRouter>
  );
}
