'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

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
  }, [items ]);

  useEffect(() => {
    document.body.classList.toggle('cart-open', isOpen);
    document.body.classList.toggle('locked', isOpen);
  }, [isOpen]);

  const addItem = (product, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((i) => i.id === product.id);
      if (found) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { ...product, qty }];
    });
    setIsOpen(true);
  };

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id));

  const setQty = (id, qty) => {
    if (qty <= 0) return removeItem(id);
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
  };

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

  const value = {
    items, addItem, removeItem, setQty,
    count, subtotal, isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

export function formatPrice(value) {
  if (typeof value !== 'number') return 'TBA';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: value % 1 ? 2 : 0 }).format(value);
}
