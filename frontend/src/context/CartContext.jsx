import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addToCart = (product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i._id === product._id);
      if (existing) {
        return prev.map((i) =>
          i._id === product._id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  // BUG-03 (intentional): Setting qty to 0 does NOT auto-remove the item.
  // A correct implementation would call removeItem when qty reaches 0.
  // This is preserved as a boundary value test case for QA research.
  // Note: qty is clamped at minimum 0 to prevent display of negative quantities.
  const updateQty = (id, qty) => {
    const safeQty = Math.max(0, qty);
    setItems((prev) =>
      prev.map((i) => (i._id === id ? { ...i, qty: safeQty } : i))
    );
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((i) => i._id !== id));
  };

  const clearCart = () => setItems([]);

  const itemCount = items.reduce((sum, i) => sum + i.qty, 0);

  // Total only counts items with qty > 0 (BUG-03 means qty=0 items remain but cost $0)
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, updateQty, removeItem, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
