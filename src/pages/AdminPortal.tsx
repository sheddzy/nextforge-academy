import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Shield, Lock } from 'lucide-react';
import { useAppStore } from '../lib/store';
import Logo from '../components/Logo';

export default function AdminPortal() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAppStore();
  const navigate = useNavigate();

  // This page is intentionally not linked anywhere publicly
  // URL: /admin-portal — only known to admins
  useEffect(() => {
    document.title = 'Secure Access';
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      setLoading(false);
      if (result.success) {
        const user = useAppStore.getState().currentUser;
        if (user?.role === 'admin') {
          navigate('/admin');
        } else {
          setError('Access denied. Admin credentials required.');
          useAppStore.getState().logout();
        }
      } else {
        setError('Invalid credentials.');
      }
    }, 700);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-primary)' }}>
      {/* Subtle background */}
      <div className="absolute inset-0 hero-grid opacity-30" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(17,43,88,0.3) 0%, transparent 70%)' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-sm"
      >
        {/* Card */}
        <div className="rounded-2xl border p-8" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo size="md" variant="icon" />
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="w-4 h-4" style={{ color: 'var(--orange)' }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--orange)' }}>Secure Admin Access</span>
            </div>
            <h1 className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>Administration Portal</h1>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Restricted access — authorised personnel only</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl text-sm flex items-center gap-2"
                style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                <Lock className="w-4 h-4 flex-shrink-0" /> {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Admin Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="off"
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                placeholder="admin@nextforgeacademy.online"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none pr-12"
                  style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  placeholder="••••••••••••"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1" style={{ color: 'var(--text-muted)' }}>
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 font-bold text-sm disabled:opacity-60 mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Access Admin Panel
                </span>
              )}
            </button>
          </form>

          <p className="text-xs text-center mt-6" style={{ color: 'var(--text-muted)' }}>
            All access attempts are logged and monitored.
          </p>
        </div>

        {/* Tiny back link — very subtle */}
        <p className="text-center mt-4">
          <a href="/" className="text-xs" style={{ color: 'var(--text-muted)', opacity: 0.4 }}>← Back</a>
        </p>
      </motion.div>
    </div>
  );
}
