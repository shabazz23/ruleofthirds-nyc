'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('rot-cart');
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('rot-cart', JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  useEffect(() => {
    document.body.classList.toggle('cart-open', isOpen);
    document.body.classList.toggle('locked', isOpen);
  }, [isOpen]);

  const addItem = useCallback((product, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((i) => i.id === product.id);
      if (found) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { ...product, qty }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback(
    (id) => setItems((prev) => prev.filter((i) => i.id !== id)),
    [],
  );

  const setQty = useCallback(
    (id, qty) => {
      if (qty <= 0) return removeItem(id);
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
    },
    [removeItem],
  );

  // Empties the bag — used after a completed checkout.
  const clearCart = useCallback(() => setItems([]), []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const { count, subtotal } = useMemo(() => {
    let count = 0;
    let subtotal = 0;
    let priced = true;
    for (const i of items) {
      count += i.qty;
      if (typeof i.price === 'number') subtotal += i.price * i.qty;
      else priced = false;
    }
    return { count, subtotal: priced ? subtotal : null };
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      setQty,
      clearCart,
      count,
      subtotal,
      isOpen,
      openCart,
      closeCart,
    }),
    [
      items,
      addItem,
      removeItem,
      setQty,
      clearCart,
      count,
      subtotal,
      isOpen,
      openCart,
      closeCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
