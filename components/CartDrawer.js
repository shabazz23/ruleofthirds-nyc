'use client';

import { useCart, formatPrice } from './cart';

export default function CartDrawer() {
  const { items, isOpen, closeCart, setQty, removeItem, subtotal } = useCart();

  return (
    <>
      <div className="scrim" onClick={closeCart} aria-hidden="true" />
      <aside className="cart-drawer" aria-hidden={!isOpen} aria-label="Shopping bag">
        <div className="cart-head">
          <h3>Your Bag</h3>
          <button className="cart-close" onClick={closeCart} aria-label="Close bag">
            ×
          </button>
        </div>
        <div className="cart-items">
          {items.length === 0 ? (
            <p className="cart-empty">Your bag is empty.</p>
          ) : (
            items.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="ci-visual" aria-hidden="true">
                  ♭
                </div>
                <div>
                  <p className="ci-name">{item.name}</p>
                  <p className="ci-meta">{item.preorder ? 'Preorder' : 'In stock'}</p>
                  <div className="qty">
                    <button onClick={() => setQty(item.id, item.qty - 1)} aria-label="Decrease quantity">
                      −
                    </button>
                    <span>{item.qty}</span>
                    <button onClick={() => setQty(item.id, item.qty + 1)} aria-label="Increase quantity">
                      +
                    </button>
                  </div>
                  <button className="ci-remove" onClick={() => removeItem(item.id)}>
                    Remove
                  </button>
                </div>
                <div>{formatPrice(item.price != null ? item.price * item.qty : null)}</div>
              </div>
            ))
          )}
        </div>
        {items.length > 0 && (
          <div className="cart-foot">
            <div className="cart-row">
              <span>Subtotal</span>
              <span>{subtotal != null ? formatPrice(subtotal) : 'TBA'}</span>
            </div>
            <button className="btn" disabled>
              Checkout — coming soon
            </button>
            <p className="cart-note">Secure checkout opens with our store launch.</p>
          </div>
        )}
      </aside>
    </>
  );
}
