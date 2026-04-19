import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import { useAppStore } from '../lib/store';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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

  const demoAccounts = [
    { label: 'Admin', email: 'admin@nextforge.academy', pass: 'admin123', color: '#f59e0b' },
    { label: 'Instructor', email: 'sarah@nextforge.academy', pass: 'password123', color: '#8b5cf6' },
    { label: 'Student', email: 'student@nextforge.academy', pass: 'password123', color: 'var(--accent-primary)' },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      <div className="hidden lg:flex flex-1 flex-col justify-center px-16" style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}>
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-white">NextForge Academy</span>
          </div>
          <h2 className="text-4xl font-black text-white mb-4">Welcome back to your learning journey</h2>
          <p className="text-white/80 text-lg mb-8">Continue where you left off. Your courses, certificates, and progress are waiting.</p>
          <div className="space-y-3">
            {['Access 500+ premium courses', 'Track your progress', 'Earn certificates', 'Join 50K+ learners'].map(item => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-white/90">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}>
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>NextForge Academy</span>
          </div>

          <h1 className="text-3xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>Sign In</h1>
          <p className="mb-8" style={{ color: 'var(--text-muted)' }}>Don't have an account? <Link to="/register" style={{ color: 'var(--accent-primary)' }} className="font-semibold">Sign up free</Link></p>

          {/* Demo accounts */}
          <div className="mb-6 p-4 rounded-xl border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
            <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-muted)' }}>DEMO ACCOUNTS (click to fill)</p>
            <div className="flex gap-2">
              {demoAccounts.map(acc => (
                <button key={acc.label} onClick={() => { setEmail(acc.email); setPassword(acc.pass); }}
                  className="flex-1 py-2 rounded-lg text-xs font-bold text-white transition-all hover:opacity-90"
                  style={{ background: acc.color }}>
                  {acc.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none pr-12"
                  style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  placeholder="••••••••" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1" style={{ color: 'var(--text-muted)' }}>
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm" style={{ color: 'var(--accent-primary)' }}>Forgot password?</Link>
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3.5 font-bold text-base flex items-center justify-center gap-2 disabled:opacity-70">
              {loading ? 'Signing in...' : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

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
        if (form.role === 'instructor') navigate('/instructor');
        else navigate('/dashboard');
      } else {
        setError(result.error || 'Registration failed');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      <div className="hidden lg:flex flex-1 flex-col justify-center px-16" style={{ background: 'linear-gradient(135deg, var(--accent-secondary), var(--accent-primary))' }}>
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-white">NextForge Academy</span>
          </div>
          <h2 className="text-4xl font-black text-white mb-4">Start your learning journey today</h2>
          <p className="text-white/80 text-lg mb-8">Join 50,000+ students and instructors building the future of tech in Africa.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <h1 className="text-3xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>Create Account</h1>
          <p className="mb-8" style={{ color: 'var(--text-muted)' }}>Already have an account? <Link to="/login" style={{ color: 'var(--accent-primary)' }} className="font-semibold">Sign in</Link></p>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {(['student', 'instructor'] as const).map(role => (
              <button key={role} onClick={() => setForm(f => ({ ...f, role }))}
                className="p-4 rounded-xl border text-center transition-all"
                style={{
                  borderColor: form.role === role ? 'var(--accent-primary)' : 'var(--border-color)',
                  background: form.role === role ? 'rgba(99,102,241,0.1)' : 'var(--bg-card)',
                }}>
                <div className="text-2xl mb-1">{role === 'student' ? '🎓' : '👨‍🏫'}</div>
                <p className="font-semibold text-sm capitalize" style={{ color: form.role === role ? 'var(--accent-primary)' : 'var(--text-primary)' }}>{role}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{role === 'student' ? 'Learn & grow' : 'Teach & earn'}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
              <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Email Address</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none pr-12"
                  style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  placeholder="Min. 8 characters" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1" style={{ color: 'var(--text-muted)' }}>
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {form.role === 'instructor' && (
              <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}>
                ⚠️ Instructor accounts require admin approval before you can create courses.
              </div>
            )}
            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3.5 font-bold text-base flex items-center justify-center gap-2 disabled:opacity-70">
              {loading ? 'Creating account...' : <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>}
            </button>
            <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
              By signing up, you agree to our Terms of Service and Privacy Policy.
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md px-4">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(99,102,241,0.15)' }}>
          <Check className="w-10 h-10" style={{ color: 'var(--accent-primary)' }} />
        </div>
        <h2 className="text-2xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>Application Submitted!</h2>
        <p className="mb-6" style={{ color: 'var(--text-muted)' }}>We'll review your application within 3-5 business days and reach out via email.</p>
        <Link to="/" className="btn-primary px-6 py-3 inline-block">Back to Home</Link>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen py-20" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>Become an Instructor</h1>
          <p style={{ color: 'var(--text-muted)' }}>Share your expertise with 50,000+ students across Africa and beyond</p>
        </div>
        <div className="rounded-2xl border p-8" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                  style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Email</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                  style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Area of Expertise</label>
              <input value={form.expertise} onChange={e => setForm(f => ({ ...f, expertise: e.target.value }))} required
                placeholder="e.g., Full-Stack Development, Data Science, DevOps"
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Years of Experience</label>
              <select value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))} required
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                <option value="">Select...</option>
                <option>1-2 years</option>
                <option>3-5 years</option>
                <option>5-10 years</option>
                <option>10+ years</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Tell us about yourself</label>
              <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} required rows={4}
                placeholder="Your background, experience, and what you'd like to teach..."
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none"
                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
            </div>
            <button type="submit" className="btn-primary w-full py-4 font-bold text-base">
              Submit Application
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
