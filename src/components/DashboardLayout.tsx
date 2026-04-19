import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, LayoutDashboard, BookOpen, Users, Settings, LogOut,
  Bell, Menu, X, BarChart3, PlusCircle, FileText, Award, MessageSquare,
  ChevronRight, Shield, ClipboardList, TrendingUp, Home, CreditCard, Star
} from 'lucide-react';
import { useAppStore } from '../lib/store';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

const studentNav: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'My Courses', href: '/dashboard/courses', icon: <BookOpen className="w-4 h-4" /> },
  { label: 'Certificates', href: '/dashboard/certificates', icon: <Award className="w-4 h-4" /> },
  { label: 'Progress', href: '/dashboard/progress', icon: <TrendingUp className="w-4 h-4" /> },
  { label: 'Payments', href: '/dashboard/payments', icon: <CreditCard className="w-4 h-4" /> },
  { label: 'Profile', href: '/dashboard/profile', icon: <Settings className="w-4 h-4" /> },
];

const instructorNav: NavItem[] = [
  { label: 'Dashboard', href: '/instructor', icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'My Course', href: '/instructor/course', icon: <BookOpen className="w-4 h-4" /> },
  { label: 'Students', href: '/instructor/students', icon: <Users className="w-4 h-4" /> },
  { label: 'Reviews', href: '/instructor/reviews', icon: <Star className="w-4 h-4" /> },
  { label: 'Announcements', href: '/instructor/announcements', icon: <MessageSquare className="w-4 h-4" /> },
  { label: 'Course Request', href: '/instructor/request', icon: <ClipboardList className="w-4 h-4" /> },
  { label: 'Profile', href: '/instructor/profile', icon: <Settings className="w-4 h-4" /> },
];

const adminNav: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'Users', href: '/admin/users', icon: <Users className="w-4 h-4" /> },
  { label: 'Courses', href: '/admin/courses', icon: <BookOpen className="w-4 h-4" /> },
  { label: 'Instructor Requests', href: '/admin/requests', icon: <ClipboardList className="w-4 h-4" /> },
  { label: 'Payments', href: '/admin/payments', icon: <CreditCard className="w-4 h-4" /> },
  { label: 'Analytics', href: '/admin/analytics', icon: <BarChart3 className="w-4 h-4" /> },
  { label: 'Settings', href: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
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

  const roleColor = currentUser?.role === 'admin' ? '#f59e0b'
    : currentUser?.role === 'instructor' ? '#8b5cf6'
    : 'var(--accent-primary)';

  const handleLogout = () => { logout(); navigate('/'); };

  const isActive = (href: string) => location.pathname === href;

  const Sidebar = ({ mobile = false }) => (
    <div className={`flex flex-col h-full ${mobile ? '' : 'w-64'}`} style={{ background: 'var(--bg-sidebar)' }}>
      <div className="p-5 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <Link to="/" className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}>
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>NextForge</span>
        </Link>
        <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-card)' }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ background: `linear-gradient(135deg, ${roleColor}, var(--accent-secondary))` }}>
            {currentUser?.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{currentUser?.name}</p>
            <p className="text-xs" style={{ color: roleColor }}>{roleLabel}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(item => (
          <Link
            key={item.href}
            to={item.href}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
              isActive(item.href) ? 'sidebar-active' : 'sidebar-link'
            }`}
          >
            <span className={`transition-colors ${isActive(item.href) ? 'text-white' : ''}`}>{item.icon}</span>
            {item.label}
            {item.badge && <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-red-500 text-white">{item.badge}</span>}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t space-y-1" style={{ borderColor: 'var(--border-color)' }}>
        <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium sidebar-link">
          <Home className="w-4 h-4" /> Back to Site
        </Link>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-red-500/10" style={{ color: '#ef4444' }}>
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col border-r flex-shrink-0" style={{ borderColor: 'var(--border-color)', width: '256px' }}>
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-72 z-50 md:hidden border-r"
              style={{ borderColor: 'var(--border-color)' }}>
              <Sidebar mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center justify-between px-4 sm:px-6 h-16 border-b flex-shrink-0" style={{ background: 'var(--bg-nav)', borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-lg" style={{ color: 'var(--text-primary)' }}>
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{roleLabel}</h1>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{location.pathname}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg relative" style={{ color: 'var(--text-muted)' }}>
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500"></span>
            </button>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: `linear-gradient(135deg, ${roleColor}, var(--accent-secondary))` }}>
              {currentUser?.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
