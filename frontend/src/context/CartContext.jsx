import { createContext, useContext, useEffect, useState } from 'react';
import { deliveryFee } from '../utils/format';
const Ctx = createContext(null);
export const useCart = () => useContext(Ctx);
export function CartProvider({ children }) {
  const [cartItems, setItems] = useState(() => { try { return JSON.parse(localStorage.getItem('cart')) || []; } catch { return []; } });
  useEffect(() => localStorage.setItem('cart', JSON.stringify(cartItems)), [cartItems]);
  const addToCart = (p, qty = 1) => setItems((items) => {
    const ex = items.find((i) => i.id === p.id);
    if (ex) return items.map((i) => (i.id === p.id ? { ...i, quantity: i.quantity + qty } : i));
    return [...items, { id: p.id, name: p.name, price: Number(p.price), image: p.image, category: p.category, quantity: qty }];
  });
  const removeFromCart = (id) => setItems((i) => i.filter((x) => x.id !== id));
  const increaseQuantity = (id) => setItems((i) => i.map((x) => (x.id === id ? { ...x, quantity: x.quantity + 1 } : x)));
  const decreaseQuantity = (id) => setItems((i) => i.map((x) => (x.id === id ? { ...x, quantity: Math.max(1, x.quantity - 1) } : x)));
  const clearCart = () => setItems([]);
  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const delivery = deliveryFee(subtotal);
  const count = cartItems.reduce((s, i) => s + i.quantity, 0);
  return <Ctx.Provider value={{ cartItems, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart, subtotal, delivery, total: subtotal + delivery, count }}>{children}</Ctx.Provider>;
}
