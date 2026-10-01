import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { errMsg } from '../utils/format';

function AuthForm({ mode }) {
  const isLogin = mode === 'login';
  const { login, register } = useAuth(); const nav = useNavigate(); const loc = useLocation(); const toast = useToast();
  const [f, setF] = useState({ name: '', email: isLogin ? 'demo@shopsense.com' : '', password: isLogin ? 'Demo@123' : '' });
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault(); setErr(''); setBusy(true);
    try {
      if (isLogin) await login(f.email, f.password); else await register(f.name, f.email, f.password);
      toast(isLogin ? 'Welcome back!' : 'Account created'); nav(loc.state?.from || '/', { replace: true });
    } catch (e2) { setErr(errMsg(e2)); } finally { setBusy(false); }
  };
  return (
    <div className="container py-5" style={{ maxWidth: 460 }}>
      <div className="ss-panel">
        <h3 className="mb-3">{isLogin ? 'Log in to ShopSense' : 'Create your account'}</h3>
        {err && <div className="alert alert-danger">{err}</div>}
        <form onSubmit={submit}>
          {!isLogin && <input className="form-control mb-3" placeholder="Full name" value={f.name} onChange={set('name')} required />}
          <input type="email" className="form-control mb-3" placeholder="Email" value={f.email} onChange={set('email')} required />
          <input type="password" className="form-control mb-3" placeholder="Password" value={f.password} onChange={set('password')} minLength={6} required />
          <button className="btn btn-primary w-100" disabled={busy}>{busy ? 'Please wait...' : isLogin ? 'Log in' : 'Register'}</button>
        </form>
        <div className="mt-3 small">{isLogin ? <>New here? <Link to="/register">Create an account</Link></> : <>Have an account? <Link to="/login">Log in</Link></>}</div>
      </div>
    </div>
  );
}
export const Login = () => <AuthForm mode="login" />;
export const Register = () => <AuthForm mode="register" />;
