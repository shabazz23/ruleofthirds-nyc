'use client';

import Image from 'next/image';
import { useCart } from './cart';
import { formatPrice } from './format';

export default function CartDrawer() {
  const { items, isOpen, closeCart, setQty, removeItem, subtotal } = useCart();

  const shipping = items.length > 0 ? Math.max(...items.map((i) => i.shippingCost || 0)) : 0;
  const total = subtotal != null ? subtotal + shipping : null;

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
                <div className="ci-visual">
                  {item.image ? (
                    <Image src={item.image} alt="" width={168} height={168} />
                  ) : (
                    <span aria-hidden="true">♭</span>
                  )}
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
            <div className="cart-row cart-row-sub">
              <span>Subtotal</span>
              <span>{subtotal != null ? formatPrice(subtotal) : 'TBA'}</span>
            </div>
            <div className="cart-row cart-row-sub">
              <span>Shipping</span>
              <span>{formatPrice(shipping)}</span>
            </div>
            <div className="cart-row">
              <span>Total</span>
              <span>{total != null ? formatPrice(total) : 'TBA'}</span>
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
