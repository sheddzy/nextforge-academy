import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, Menu, X, ChevronDown, Bell, User, LogOut,
  BookOpen, LayoutDashboard, Settings, Users, BarChart3, Shield
} from 'lucide-react';
import { useAppStore } from '../lib/store';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { currentUser, isAuthenticated, logout } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserMenuOpen(false);
  };

  const getDashboardLink = () => {
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

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b" style={{ background: 'var(--bg-nav)', borderColor: 'var(--border-color)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}>
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--text-primary)' }}>
                NextForge <span style={{ color: 'var(--accent-primary)' }}>Academy</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive(link.href) ? 'nav-active' : 'nav-link'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Auth */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated && currentUser ? (
                <>
                  <Link to={getDashboardLink()} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium nav-link">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl border transition-all hover:border-accent"
                      style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
                    >
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}>
                        {currentUser.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{currentUser.name.split(' ')[0]}</span>
                      <ChevronDown className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                    </button>
                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-52 rounded-xl border shadow-xl py-1"
                          style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                        >
                          <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
                            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{currentUser.name}</p>
                            <p className="text-xs capitalize" style={{ color: 'var(--text-muted)' }}>{currentUser.role}</p>
                          </div>
                          <Link to={getDashboardLink()} onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent/10 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                            <LayoutDashboard className="w-4 h-4" /> Dashboard
                          </Link>
                          <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent/10 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                            <User className="w-4 h-4" /> Profile
                          </Link>
                          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-red-500/10 transition-colors" style={{ color: '#ef4444' }}>
                            <LogOut className="w-4 h-4" /> Sign Out
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-4 py-2 text-sm font-medium rounded-lg nav-link">Sign In</Link>
                  <Link to="/register" className="btn-primary px-5 py-2 text-sm">Get Started</Link>
                </>
              )}
            </div>

            {/* Mobile toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg" style={{ color: 'var(--text-primary)' }}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t"
              style={{ borderColor: 'var(--border-color)', background: 'var(--bg-nav)' }}
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map(link => (
                  <Link key={link.href} to={link.href} onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      isActive(link.href) ? 'nav-active' : 'nav-link'
                    }`}>
                    {link.label}
                  </Link>
                ))}
                <div className="pt-3 border-t space-y-2" style={{ borderColor: 'var(--border-color)' }}>
                  {isAuthenticated ? (
                    <>
                      <Link to={getDashboardLink()} onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg text-sm font-medium nav-link">Dashboard</Link>
                      <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium" style={{ color: '#ef4444' }}>Sign Out</button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg text-sm font-medium nav-link">Sign In</Link>
                      <Link to="/register" onClick={() => setMobileOpen(false)} className="block btn-primary px-4 py-3 text-sm text-center">Get Started Free</Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t mt-auto" style={{ background: 'var(--bg-footer)', borderColor: 'var(--border-color)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}>
                  <GraduationCap className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold" style={{ color: 'var(--text-primary)' }}>NextForge Academy</span>
              </Link>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Empowering the next generation of tech professionals.</p>
            </div>
            {[['Platform', ['Courses', 'Pricing', 'About', 'Blog']], ['Company', ['Careers', 'Press', 'Partners', 'Legal']], ['Support', ['Help Center', 'Contact', 'Community', 'Status']]].map(([title, links]) => (
              <div key={title as string}>
                <h4 className="font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>{title as string}</h4>
                <ul className="space-y-2">
                  {(links as string[]).map(l => <li key={l}><a href="#" className="text-sm hover:text-accent transition-colors" style={{ color: 'var(--text-muted)' }}>{l}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderColor: 'var(--border-color)' }}>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>© 2024 NextForge Academy. All rights reserved.</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Built for production · Powered by NextForge</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
