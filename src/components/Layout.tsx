import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, Menu, X, ChevronDown, LayoutDashboard,
  LogOut, User, BookOpen, Info, DollarSign, Phone, UserPlus
} from 'lucide-react';
import { useAppStore } from '../lib/store';

const navLinks = [
  { label: 'Courses', href: '/courses', icon: <BookOpen className="w-4 h-4" /> },
  { label: 'About', href: '/about', icon: <Info className="w-4 h-4" /> },
  { label: 'Pricing', href: '/pricing', icon: <DollarSign className="w-4 h-4" /> },
  { label: 'Contact', href: '/contact', icon: <Phone className="w-4 h-4" /> },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const { currentUser, isAuthenticated, logout } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();

  const dashboardHref =
    currentUser?.role === 'admin' ? '/admin' :
    currentUser?.role === 'instructor' ? '/instructor' : '/dashboard';

  const handleLogout = () => { logout(); navigate('/'); setUserMenu(false); };
  const isActive = (href: string) => location.pathname === href || location.pathname.startsWith(href + '/');

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      {/* ── Navbar ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b" style={{ background: 'var(--bg-nav)', borderColor: 'var(--border-color)', backdropFilter: 'blur(16px)' }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex items-center h-16 gap-8">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}>
                <GraduationCap className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
              </div>
              <span className="font-bold text-[15px] tracking-tight hidden sm:block" style={{ color: 'var(--text-primary)' }}>
                NextForge <span style={{ color: 'var(--accent-primary)' }}>Academy</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-1 flex-1">
              {navLinks.map(link => (
                <Link key={link.href} to={link.href}
                  className={`nav-link px-4 py-2 text-sm ${isActive(link.href) ? 'nav-active' : ''}`}>
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Auth */}
            <div className="hidden lg:flex items-center gap-3 ml-auto">
              {isAuthenticated && currentUser ? (
                <>
                  <Link to={dashboardHref}
                    className="nav-link flex items-center gap-2 px-4 py-2 text-sm">
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                  <div className="relative">
                    <button onClick={() => setUserMenu(!userMenu)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all hover:border-indigo-500/40"
                      style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}>
                        {currentUser.name.charAt(0)}
                      </div>
                      <div className="text-left hidden xl:block">
                        <p className="text-xs font-semibold leading-none mb-0.5" style={{ color: 'var(--text-primary)' }}>{currentUser.name.split(' ')[0]}</p>
                        <p className="text-[10px] capitalize" style={{ color: 'var(--text-muted)' }}>{currentUser.role}</p>
                      </div>
                      <ChevronDown className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                    </button>

                    <AnimatePresence>
                      {userMenu && (
                        <motion.div initial={{ opacity: 0, y: -6, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.96 }}
                          transition={{ duration: 0.12 }}
                          className="absolute right-0 mt-2 w-52 rounded-xl border shadow-2xl overflow-hidden"
                          style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                          <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
                            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{currentUser.name}</p>
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{currentUser.email}</p>
                          </div>
                          <Link to={dashboardHref} onClick={() => setUserMenu(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-white/5 transition-colors"
                            style={{ color: 'var(--text-secondary)' }}>
                            <LayoutDashboard className="w-4 h-4" /> Dashboard
                          </Link>
                          <Link to="/dashboard/profile" onClick={() => setUserMenu(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-white/5 transition-colors"
                            style={{ color: 'var(--text-secondary)' }}>
                            <User className="w-4 h-4" /> Profile
                          </Link>
                          <div className="border-t" style={{ borderColor: 'var(--border-color)' }} />
                          <button onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-red-500/10 transition-colors"
                            style={{ color: 'var(--red)' }}>
                            <LogOut className="w-4 h-4" /> Sign Out
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="nav-link px-4 py-2 text-sm">Sign In</Link>
                  <Link to="/register" className="btn-primary px-5 py-2 text-sm gap-2">
                    <UserPlus className="w-4 h-4" /> Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden ml-auto p-2 rounded-lg btn-ghost">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t overflow-hidden" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}>
              <div className="max-w-[1400px] mx-auto px-6 py-4 space-y-1">
                {navLinks.map(link => (
                  <Link key={link.href} to={link.href} onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${isActive(link.href) ? 'nav-active' : 'nav-link'}`}>
                    {link.icon} {link.label}
                  </Link>
                ))}
                <div className="pt-3 border-t space-y-2" style={{ borderColor: 'var(--border-color)' }}>
                  {isAuthenticated ? (
                    <>
                      <Link to={dashboardHref} onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium nav-link">
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Link>
                      <button onClick={() => { handleLogout(); setMobileOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium"
                        style={{ color: 'var(--red)' }}>
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium nav-link">
                        Sign In
                      </Link>
                      <Link to="/register" onClick={() => setMobileOpen(false)}
                        className="btn-primary w-full py-3 text-sm">
                        Get Started Free
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">{children}</main>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="border-t" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-14">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-10">
            <div className="col-span-2">
              <Link to="/" className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}>
                  <GraduationCap className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold" style={{ color: 'var(--text-primary)' }}>NextForge Academy</span>
              </Link>
              <p className="text-sm max-w-xs" style={{ color: 'var(--text-muted)' }}>
                Africa's #1 tech learning platform. Master in-demand skills and build your future.
              </p>
              <p className="text-xs mt-4" style={{ color: 'var(--text-muted)' }}>nextforgeacademy.online</p>
            </div>
            {[
              ['Platform', ['Courses', 'Pricing', 'About', 'Blog']],
              ['Company', ['Careers', 'Press', 'Partners', 'Legal']],
              ['Support', ['Help Center', 'Contact', 'Community', 'Status']],
            ].map(([title, links]) => (
              <div key={title as string}>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>{title as string}</h4>
                <ul className="space-y-2.5">
                  {(links as string[]).map(l => (
                    <li key={l}><a href="#" className="text-sm transition-colors hover:text-indigo-400" style={{ color: 'var(--text-secondary)' }}>{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: 'var(--border-color)' }}>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>© 2024 NextForge Academy. All rights reserved.</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Secured by Paystack · Built for Northflank</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
