import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, LayoutDashboard, BookOpen, Users, Settings, LogOut,
  Bell, Menu, X, BarChart3, Award, MessageSquare, ClipboardList,
  TrendingUp, Home, CreditCard, Star, ChevronRight, Shield
} from 'lucide-react';
import { useAppStore } from '../lib/store';

interface NavItem { label: string; href: string; icon: React.ReactNode; badge?: number; }

const studentNav: NavItem[] = [
  { label: 'Overview',     href: '/dashboard',              icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'My Courses',   href: '/dashboard/courses',      icon: <BookOpen className="w-4 h-4" /> },
  { label: 'Progress',     href: '/dashboard/progress',     icon: <TrendingUp className="w-4 h-4" /> },
  { label: 'Certificates', href: '/dashboard/certificates', icon: <Award className="w-4 h-4" /> },
  { label: 'Payments',     href: '/dashboard/payments',     icon: <CreditCard className="w-4 h-4" /> },
  { label: 'Profile',      href: '/dashboard/profile',      icon: <Settings className="w-4 h-4" /> },
];

const instructorNav: NavItem[] = [
  { label: 'Overview',      href: '/instructor',              icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'My Course',     href: '/instructor/course',       icon: <BookOpen className="w-4 h-4" /> },
  { label: 'Students',      href: '/instructor/students',     icon: <Users className="w-4 h-4" /> },
  { label: 'Reviews',       href: '/instructor/reviews',      icon: <Star className="w-4 h-4" /> },
  { label: 'Announcements', href: '/instructor/announcements',icon: <MessageSquare className="w-4 h-4" /> },
  { label: 'Course Request',href: '/instructor/request',      icon: <ClipboardList className="w-4 h-4" /> },
  { label: 'Profile',       href: '/instructor/profile',      icon: <Settings className="w-4 h-4" /> },
];

const adminNav: NavItem[] = [
  { label: 'Dashboard',    href: '/admin',           icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'Users',        href: '/admin/users',     icon: <Users className="w-4 h-4" /> },
  { label: 'Courses',      href: '/admin/courses',   icon: <BookOpen className="w-4 h-4" /> },
  { label: 'Requests',     href: '/admin/requests',  icon: <ClipboardList className="w-4 h-4" /> },
  { label: 'Payments',     href: '/admin/payments',  icon: <CreditCard className="w-4 h-4" /> },
  { label: 'Analytics',    href: '/admin/analytics', icon: <BarChart3 className="w-4 h-4" /> },
  { label: 'Settings',     href: '/admin/settings',  icon: <Settings className="w-4 h-4" /> },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, logout } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = currentUser?.role === 'admin' ? adminNav
    : currentUser?.role === 'instructor' ? instructorNav
    : studentNav;

  const roleLabel = currentUser?.role === 'admin' ? 'Admin Panel'
    : currentUser?.role === 'instructor' ? 'Instructor Studio'
    : 'Student Portal';

  const roleColor = currentUser?.role === 'admin' ? 'var(--yellow)'
    : currentUser?.role === 'instructor' ? 'var(--accent-secondary)'
    : 'var(--accent-primary)';

  const handleLogout = () => { logout(); navigate('/'); };
  const isActive = (href: string) => location.pathname === href;

  const SidebarContent = () => (
    <div className="flex flex-col h-full" style={{ background: 'var(--bg-sidebar)' }}>
      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <Link to="/" className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}>
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>NextForge</span>
        </Link>

        {/* User card */}
        <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${roleColor}, var(--accent-secondary))` }}>
            {currentUser?.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{currentUser?.name}</p>
            <p className="text-xs" style={{ color: roleColor }}>{roleLabel}</p>
          </div>
          {currentUser?.role === 'admin' && <Shield className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--yellow)' }} />}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-bold uppercase tracking-widest px-3 mb-2" style={{ color: 'var(--text-muted)' }}>Navigation</p>
        {navItems.map(item => (
          <Link key={item.href} to={item.href} onClick={() => setSidebarOpen(false)}
            className={`sidebar-link ${isActive(item.href) ? 'sidebar-active' : ''}`}>
            <span className="flex-shrink-0">{item.icon}</span>
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500 text-white font-bold">{item.badge}</span>
            )}
            {isActive(item.href) && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t space-y-0.5" style={{ borderColor: 'var(--border-color)' }}>
        <Link to="/" className="sidebar-link">
          <Home className="w-4 h-4" /> Back to Site
        </Link>
        <button onClick={handleLogout} className="sidebar-link w-full" style={{ color: 'var(--red)' }}>
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Desktop Sidebar — fixed 240px */}
      <aside className="hidden md:flex flex-col w-60 flex-shrink-0 border-r" style={{ borderColor: 'var(--border-color)' }}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-64 z-50 md:hidden border-r"
              style={{ borderColor: 'var(--border-color)' }}>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Topbar */}
        <header className="flex items-center justify-between px-5 sm:px-8 h-14 border-b flex-shrink-0"
          style={{ background: 'var(--bg-nav)', borderColor: 'var(--border-color)', backdropFilter: 'blur(12px)' }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden btn-ghost p-2">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{roleLabel}</h1>
              <p className="text-xs hidden sm:block" style={{ color: 'var(--text-muted)' }}>
                {navItems.find(n => isActive(n.href))?.label || 'Dashboard'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-ghost p-2 relative">
              <Bell className="w-4.5 h-4.5" style={{ width: 18, height: 18, color: 'var(--text-muted)' }} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-red-500" />
            </button>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ background: `linear-gradient(135deg, ${roleColor}, var(--accent-secondary))` }}>
              {currentUser?.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-7">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
