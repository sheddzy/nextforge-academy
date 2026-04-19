import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { GraduationCap, Menu, X, ChevronDown, LayoutDashboard, LogOut, User, BookOpen } from 'lucide-react';
import { useAppStore } from '../lib/store';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const { currentUser, isAuthenticated, logout } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); setUserOpen(false); };

  const dashLink = () => {
    if (!currentUser) return '/login';
    if (currentUser.role === 'admin') return '/admin';
    if (currentUser.role === 'instructor') return '/instructor';
    return '/dashboard';
  };

  const navLinks = [
    { label: 'Courses', href: '/courses' },
    { label: 'About', href: '/about' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => location.pathname === href || location.pathname.startsWith(href + '/');

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      <nav className="sticky top-0 z-50 border-b" style={{ background: 'var(--bg-nav)', borderColor: 'var(--border-color)', backdropFilter: 'blur(16px)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16 gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent2))' }}>
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm tracking-tight hidden sm:block" style={{ color: 'var(--text-primary)' }}>
              NextForge <span style={{ color: 'var(--accent2)' }}>Academy</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1 flex-1">
            {navLinks.map(l => (
              <Link key={l.href} to={l.href}
                className={`px-3 py-2 text-sm font-medium rounded-lg ${isActive(l.href) ? 'nav-active' : 'nav-link'}`}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-2 ml-auto">
            {isAuthenticated && currentUser ? (
              <>
                <Link to={dashLink()} className="nav-link px-3 py-2 text-sm font-medium rounded-lg flex items-center gap-1.5">
                  <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
                </Link>
                <div className="relative">
                  <button onClick={() => setUserOpen(!userOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm"
                    style={{ borderColor: 'var(--border-mid)', background: 'var(--bg-card)' }}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent2))' }}>
                      {currentUser.name.charAt(0)}
                    </div>
                    <span style={{ color: 'var(--text-primary)' }}>{currentUser.name.split(' ')[0]}</span>
                    <ChevronDown className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                  </button>
                  <AnimatePresence>
                    {userOpen && (
                      <motion.div initial={{ opacity: 0, y: -6, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: .97 }} transition={{ duration: .12 }}
                        className="absolute right-0 mt-2 w-48 rounded-2xl border shadow-2xl py-1.5 overflow-hidden"
                        style={{ background: 'var(--bg-card2)', borderColor: 'var(--border-mid)' }}>
                        <div className="px-4 py-2.5 border-b mb-1" style={{ borderColor: 'var(--border-color)' }}>
                          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{currentUser.name}</p>
                          <p className="text-xs capitalize" style={{ color: 'var(--text-muted)' }}>{currentUser.role}</p>
                        </div>
                        <Link to={dashLink()} onClick={() => setUserOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm nav-link mx-1 rounded-lg">
                          <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
                        </Link>
                        <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm mx-1 rounded-lg" style={{ color: 'var(--red)' }}>
                          <LogOut className="w-3.5 h-3.5" /> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link px-4 py-2 text-sm font-medium rounded-lg">Sign In</Link>
                <Link to="/register" className="btn-primary px-4 py-2 text-sm">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden ml-auto p-2 rounded-lg btn-ghost">
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t overflow-hidden" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-nav)' }}>
              <div className="px-4 py-4 space-y-1">
                {navLinks.map(l => (
                  <Link key={l.href} to={l.href} onClick={() => setMobileOpen(false)}
                    className={`block px-3 py-2.5 text-sm font-medium rounded-xl ${isActive(l.href) ? 'nav-active' : 'nav-link'}`}>
                    {l.label}
                  </Link>
                ))}
                <div className="pt-3 mt-3 border-t space-y-1" style={{ borderColor: 'var(--border-color)' }}>
                  {isAuthenticated ? (
                    <>
                      <Link to={dashLink()} onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm font-medium rounded-xl nav-link">Dashboard</Link>
                      <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="w-full text-left px-3 py-2.5 text-sm font-medium rounded-xl" style={{ color: 'var(--red)' }}>Sign Out</button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm font-medium rounded-xl nav-link">Sign In</Link>
                      <Link to="/register" onClick={() => setMobileOpen(false)} className="block btn-primary px-3 py-2.5 text-sm text-center rounded-xl">Get Started</Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-1">{children}</main>

      <footer className="border-t" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent2))' }}>
                  <GraduationCap className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>NextForge Academy</span>
              </Link>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>Empowering Africa's next generation of tech professionals.</p>
            </div>
            {[['Platform', ['Courses', 'Pricing', 'About', 'Blog']], ['Company', ['Careers', 'Press', 'Partners', 'Legal']], ['Support', ['Help Center', 'Contact', 'Community', 'Status']]].map(([title, links]) => (
              <div key={title as string}>
                <h4 className="font-semibold text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>{title as string}</h4>
                <ul className="space-y-2">
                  {(links as string[]).map(l => <li key={l}><a href="#" className="text-sm nav-link px-0 rounded-none" style={{ color: 'var(--text-muted)' }}>{l}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderColor: 'var(--border-color)' }}>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>© 2025 NextForge Academy · nextforgeacademy.online</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Built for production · Powered by NextForge</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
