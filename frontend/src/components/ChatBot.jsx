import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles } from 'lucide-react';
import api from '../api/axios';
import { useChat } from '../context/ChatContext';

export default function ChatBot() {
  const { isOpen, toggle, close } = useChat();
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: "Hi! I'm ShopLab AI 👋 How can I help you today? Ask me about products, orders, or shipping.",
    },
  ]);
  const [input, setInput] = useState('');
  // BUG-05 (intentional): no timeout — loading can hang indefinitely on slow API
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 350);
  }, [isOpen]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setLoading(true);
    try {
      const res = await api.post('/chatbot/message', { message: text });
      setMessages((prev) => [...prev, { role: 'bot', text: res.data.reply }]);
    } catch (err) {
      const errMsg = err.response?.data?.error || "Sorry, I'm having trouble right now. Please try again.";
      setMessages((prev) => [...prev, { role: 'bot', text: errMsg }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={toggle}
        style={{ ...styles.fab, ...(isOpen ? styles.fabActive : {}) }}
        data-testid="chatbot-toggle"
        aria-label="Toggle AI assistant"
        title="ShopLab AI Assistant"
      >
        {isOpen ? <X size={22} /> : <Bot size={22} />}
      </button>

      {/* Sliding Panel */}
      <div
        style={{ ...styles.panel, ...(isOpen ? styles.panelOpen : {}) }}
        data-testid="chatbot-window"
      >
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.botAvatar}>
              <Sparkles size={16} color="#fff" />
            </div>
            <div>
              <p style={styles.headerTitle}>ShopLab AI</p>
              <div style={styles.onlineRow}>
                <span style={styles.onlineDot} />
                <span style={styles.onlineText}>Online</span>
              </div>
            </div>
          </div>
          <button
            onClick={close}
            style={styles.closeBtn}
            data-testid="chatbot-close"
            aria-label="Close assistant"
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div style={styles.messages} data-testid="chatbot-messages">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={styles.msgRow(msg.role)}
              data-testid={`chat-msg-${idx}`}
            >
              {msg.role === 'bot' && (
                <div style={styles.botAvatarSm}>
                  <Bot size={12} color="#fff" />
                </div>
              )}
              <div style={styles.bubble(msg.role)}>
                {msg.text}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div style={styles.msgRow('bot')} data-testid="chatbot-loading">
              <div style={styles.botAvatarSm}><Bot size={12} color="#fff" /></div>
              <div style={{ ...styles.bubble('bot'), padding: '12px 16px' }}>
                <div className="typing-dots">
                  <span /><span /><span />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input row */}
        <div style={styles.inputArea}>
          <div style={styles.inputWrap}>
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              data-testid="chatbot-input"
              style={styles.chatInput}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={styles.sendBtn}
              data-testid="chatbot-send"
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </div>
          <p style={styles.poweredBy}>Powered by Gemini AI</p>
        </div>
      </div>
    </>
  );
}

const PANEL_W = 380;

const styles = {
  fab: {
    position: 'fixed',
    bottom: 28, right: 28,
    width: 54, height: 54,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    color: '#fff',
    boxShadow: '0 4px 20px rgba(79,70,229,0.45)',
    zIndex: 300,
    border: 'none',
    cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.25s ease',
  },
  fabActive: {
    background: 'linear-gradient(135deg, #374151, #1f2937)',
    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
  },
  panel: {
    position: 'fixed',
    top: 0, right: 0, bottom: 0,
    width: `${PANEL_W}px`,
    background: 'var(--surface)',
    boxShadow: '-4px 0 32px rgba(0,0,0,0.12)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 250,
    transform: 'translateX(100%)',
    transition: 'transform var(--transition)',
    borderLeft: '1px solid var(--border)',
  },
  panelOpen: {
    transform: 'translateX(0)',
  },
  header: {
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    padding: '20px 18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  botAvatar: {
    width: 40, height: 40,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.2)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.97rem',
  },
  onlineRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  onlineDot: {
    width: 7, height: 7,
    borderRadius: '50%',
    background: '#4ade80',
    boxShadow: '0 0 6px #4ade80',
  },
  onlineText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: '0.75rem',
  },
  closeBtn: {
    background: 'rgba(255,255,255,0.15)',
    border: 'none',
    color: '#fff',
    borderRadius: 'var(--radius-md)',
    width: 34, height: 34,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    background: '#f8fafc',
  },
  msgRow: (role) => ({
    display: 'flex',
    alignItems: 'flex-end',
    gap: 8,
    justifyContent: role === 'user' ? 'flex-end' : 'flex-start',
    animation: 'fadeIn 0.2s ease both',
  }),
  botAvatarSm: {
    width: 26, height: 26,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  bubble: (role) => ({
    maxWidth: '78%',
    padding: '10px 14px',
    borderRadius: role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
    fontSize: '0.875rem',
    lineHeight: 1.55,
    ...(role === 'user'
      ? {
          background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
          color: '#fff',
          boxShadow: '0 2px 8px rgba(79,70,229,0.3)',
        }
      : {
          background: '#fff',
          color: 'var(--text-1)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
        }),
  }),
  inputArea: {
    padding: '14px 16px',
    borderTop: '1px solid var(--border)',
    background: 'var(--surface)',
    flexShrink: 0,
  },
  inputWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: 'var(--surface-3)',
    borderRadius: 'var(--radius-full)',
    border: '1.5px solid var(--border)',
    padding: '4px 4px 4px 16px',
    transition: 'border-color 0.2s',
  },
  chatInput: {
    flex: 1,
    border: 'none',
    background: 'transparent',
    padding: '6px 0',
    fontSize: '0.9rem',
    outline: 'none',
    color: 'var(--text-1)',
  },
  sendBtn: {
    width: 36, height: 36,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
    transition: 'opacity 0.15s',
  },
  poweredBy: {
    textAlign: 'center',
    fontSize: '0.72rem',
    color: 'var(--text-4)',
    marginTop: 8,
  },
};
