import { createContext, useContext, useState } from 'react';

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen((o) => !o);
  const close  = () => setIsOpen(false);
  const open   = () => setIsOpen(true);
  return (
    <ChatContext.Provider value={{ isOpen, toggle, close, open }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);
