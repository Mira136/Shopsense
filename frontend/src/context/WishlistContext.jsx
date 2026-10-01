import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from '../components/Toast';
import { errMsg } from '../utils/format';
const Ctx = createContext(null);
export const useWishlist = () => useContext(Ctx);
export function WishlistProvider({ children }) {
  const { user } = useAuth(); const toast = useToast();
  const [items, setItems] = useState([]);
  const reload = useCallback(() => (user ? api.get('/wishlist').then((r) => setItems(r.data)).catch(() => {}) : setItems([])), [user]);
  useEffect(() => { reload(); }, [reload]);
  const has = (id) => items.some((p) => p.id === id);
  const toggle = async (id) => {
    if (!user) { toast('Please log in to use your wishlist', 'error'); return false; }
    try {
      if (has(id)) { await api.delete(`/wishlist/${id}`); toast('Removed from wishlist'); }
      else { await api.post(`/wishlist/${id}`); toast('Added to wishlist'); }
      await reload();
    } catch (e) { toast(errMsg(e), 'error'); }
  };
  return <Ctx.Provider value={{ items, has, toggle, reload }}>{children}</Ctx.Provider>;
}
