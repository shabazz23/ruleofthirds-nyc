'use client';

import { useState } from 'react';
import { useCart } from './cart';

export default function AddToBag({ product, label = 'Add to Bag' }) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const handle = () => {
    addItem(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <button className="btn" onClick={handle}>
      {justAdded ? 'Added ✓' : label}
    </button>
  );
}
