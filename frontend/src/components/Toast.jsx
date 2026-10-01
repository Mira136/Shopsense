import { createContext, useCallback, useContext, useState } from 'react';
const Ctx = createContext(null);
export const useToast = () => useContext(Ctx);
export function ToastProvider({ children }) {
  const [list, setList] = useState([]);
  const toast = useCallback((msg, type = 'success') => {
    const id = Date.now() + Math.random();
    setList((l) => [...l, { id, msg, type }]);
    setTimeout(() => setList((l) => l.filter((t) => t.id !== id)), 3000);
  }, []);
  return (
    <Ctx.Provider value={toast}>
      {children}
      <div className="ss-toasts">{list.map((t) => <div key={t.id} className={`ss-toast ${t.type}`}>{t.msg}</div>)}</div>
    </Ctx.Provider>
  );
}
