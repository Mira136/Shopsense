import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(!!localStorage.getItem('token'));
  useEffect(() => {
    if (!token) { setLoading(false); return; }
    api.get('/auth/me').then((r) => setUser(r.data.user))
      .catch(() => { localStorage.removeItem('token'); setToken(null); })
      .finally(() => setLoading(false));
  }, [token]);
  const save = (d) => { localStorage.setItem('token', d.token); setToken(d.token); setUser(d.user); };
  const login = async (email, password) => save((await api.post('/auth/login', { email, password })).data);
  const register = async (name, email, password) => save((await api.post('/auth/register', { name, email, password })).data);
  const logout = () => { localStorage.removeItem('token'); setToken(null); setUser(null); };
  return <Ctx.Provider value={{ user, token, loading, login, register, logout }}>{children}</Ctx.Provider>;
}
