import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Check, Shield } from 'lucide-react';
import { useAppStore } from '../lib/store';

/* ─── Login ─── */
export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const { login } = useAppStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      setLoading(false);
      if (result.success) {
        const user = useAppStore.getState().currentUser;
        if (user?.role === 'admin') navigate('/admin');
        else if (user?.role === 'instructor') navigate('/instructor');
        else navigate('/dashboard');
      } else {
        setError(result.error || 'Login failed');
      }
    }, 600);
  };

  // Demo accounts — admin is hidden behind a secret toggle
  const demoAccounts = [
    { label: 'Student', email: 'student@nextforgeacademy.online', pass: 'password123', color: 'var(--accent)' },
    { label: 'Instructor', email: 'sarah@nextforgeacademy.online', pass: 'password123', color: 'var(--accent2)' },
    ...(showAdminLogin ? [{ label: 'Admin', email: 'admin@nextforgeacademy.online', pass: 'admin123', color: 'var(--amber)' }] : []),
  ];

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-16 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0d0f20 0%, #141830 100%)' }}>
        <div className="absolute inset-0 hero-grid opacity-60" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full" style={{ background: 'radial-gradient(circle, rgba(108,99,255,0.15), transparent 70%)' }} />
        <div className="relative max-w-md">
          <div className="flex items-center gap-3 mb-10">
            <img src="/logo.png" alt="NextForge Academy" className="h-10 w-auto object-contain" />
            <span className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>NextForge Academy</span>
          </div>
          <h2 className="text-4xl font-black mb-4 leading-tight" style={{ color: 'var(--text-primary)' }}>
            Welcome back to your learning journey
          </h2>
          <p className="text-base mb-8" style={{ color: 'var(--text-muted)' }}>
            Continue where you left off. Your courses, live classes, and certificates are waiting.
          </p>
          <div className="space-y-3">
            {['500+ expert-led courses', 'Live interactive classes', 'Downloadable materials', 'Industry certificates'].map(item => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(108,99,255,0.2)' }}>
                  <Check className="w-3 h-3" style={{ color: 'var(--accent2)' }} />
                </div>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <img src="/logo.png" alt="NextForge Academy" className="h-8 w-auto object-contain" />
            <span className="font-bold" style={{ color: 'var(--text-primary)' }}>NextForge Academy</span>
          </div>

          <h1 className="text-2xl font-black mb-1" style={{ color: 'var(--text-primary)' }}>Sign In</h1>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            No account? <Link to="/register" style={{ color: 'var(--accent2)' }} className="font-semibold">Create one free</Link>
          </p>

          {/* Demo accounts — admin hidden */}
          <div className="mb-5 p-3.5 rounded-xl border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
            <p className="text-xs font-semibold mb-2.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Demo Accounts</p>
            <div className="flex gap-2">
              {demoAccounts.map(acc => (
                <button key={acc.label} onClick={() => { setEmail(acc.email); setPassword(acc.pass); }}
                  className="flex-1 py-2 rounded-lg text-xs font-bold text-white transition-opacity hover:opacity-85"
                  style={{ background: acc.color }}>
                  {acc.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.08)', color: 'var(--red)', border: '1px solid rgba(239,68,68,0.2)' }}>
                {error}
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="field" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  className="field pr-12" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 btn-ghost p-1 rounded-lg" style={{ color: 'var(--text-muted)' }}>
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs" style={{ color: 'var(--accent2)' }}>Forgot password?</Link>
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3 font-bold text-sm gap-2">
              {loading ? 'Signing in...' : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          {/* Hidden admin toggle — triple-click the lock icon */}
          <div className="mt-6 text-center">
            <button onClick={() => setShowAdminLogin(!showAdminLogin)}
              className="btn-ghost p-2 rounded-lg opacity-20 hover:opacity-60 transition-opacity"
              title="Admin access">
              <Shield className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Register ─── */
export function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' as 'student' | 'instructor' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAppStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    setTimeout(() => {
      const result = register(form);
      setLoading(false);
      if (result.success) {
        navigate(form.role === 'instructor' ? '/instructor' : '/dashboard');
      } else {
        setError(result.error || 'Registration failed');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      <div className="hidden lg:flex flex-1 flex-col justify-center px-16 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0d0f20 0%, #141830 100%)' }}>
        <div className="absolute inset-0 hero-grid opacity-60" />
        <div className="relative max-w-md">
          <div className="flex items-center gap-3 mb-10">
            <img src="/logo.png" alt="NextForge Academy" className="h-10 w-auto object-contain" />
            <span className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>NextForge Academy</span>
          </div>
          <h2 className="text-4xl font-black mb-4 leading-tight" style={{ color: 'var(--text-primary)' }}>
            Start your tech journey today
          </h2>
          <p className="text-base" style={{ color: 'var(--text-muted)' }}>
            Join 50,000+ students and instructors building the future of tech in Africa.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <h1 className="text-2xl font-black mb-1" style={{ color: 'var(--text-primary)' }}>Create Account</h1>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            Already registered? <Link to="/login" style={{ color: 'var(--accent2)' }} className="font-semibold">Sign in</Link>
          </p>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {(['student', 'instructor'] as const).map(role => (
              <button key={role} onClick={() => setForm(f => ({ ...f, role }))}
                className="p-4 rounded-xl border text-center transition-all"
                style={{
                  borderColor: form.role === role ? 'var(--accent)' : 'var(--border-color)',
                  background: form.role === role ? 'rgba(108,99,255,0.08)' : 'var(--bg-card)',
                }}>
                <div className="text-2xl mb-1">{role === 'student' ? '🎓' : '👨‍🏫'}</div>
                <p className="font-semibold text-xs capitalize" style={{ color: form.role === role ? 'var(--accent2)' : 'var(--text-primary)' }}>{role}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{role === 'student' ? 'Learn & grow' : 'Teach & earn'}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.08)', color: 'var(--red)', border: '1px solid rgba(239,68,68,0.2)' }}>
                {error}
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Full Name</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required
                className="field" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Email</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required
                className="field" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required
                  className="field pr-12" placeholder="Min. 8 characters" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 btn-ghost p-1 rounded-lg" style={{ color: 'var(--text-muted)' }}>
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {form.role === 'instructor' && (
              <div className="p-3 rounded-xl text-xs" style={{ background: 'rgba(245,158,11,0.08)', color: 'var(--amber)', border: '1px solid rgba(245,158,11,0.2)' }}>
                ⚠️ Instructor accounts require admin approval before you can create courses.
              </div>
            )}
            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3 font-bold text-sm gap-2">
              {loading ? 'Creating account...' : <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>}
            </button>
            <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
              By signing up you agree to our Terms & Privacy Policy.
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export function InstructorApplyPage() {
  const [form, setForm] = useState({ name: '', email: '', expertise: '', experience: '', bio: '' });
  const [submitted, setSubmitted] = useState(false);

  if (submitted) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      <motion.div initial={{ scale: .9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-sm px-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(108,99,255,0.15)' }}>
          <Check className="w-8 h-8" style={{ color: 'var(--accent2)' }} />
        </div>
        <h2 className="text-2xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>Application Submitted!</h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>We'll review within 3–5 business days and reach out via email.</p>
        <Link to="/" className="btn-primary px-6 py-2.5 text-sm">Back to Home</Link>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen py-20" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>Become an Instructor</h1>
          <p style={{ color: 'var(--text-muted)' }}>Share your expertise with 50,000+ students</p>
        </div>
        <div className="card p-8">
          <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Full Name</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required className="field" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Email</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required className="field" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Area of Expertise</label>
              <input value={form.expertise} onChange={e => setForm(f => ({ ...f, expertise: e.target.value }))} required
                placeholder="e.g. Full-Stack Development, Data Science" className="field" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Years of Experience</label>
              <select value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))} required className="field">
                <option value="">Select...</option>
                <option>1–2 years</option><option>3–5 years</option><option>5–10 years</option><option>10+ years</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>About You</label>
              <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} required rows={4}
                placeholder="Your background, experience, what you'd like to teach..." className="field resize-none" />
            </div>
            <button type="submit" className="btn-primary w-full py-3.5 font-bold">Submit Application</button>
          </form>
        </div>
      </div>
    </div>
  );
}
