import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, Users, Settings, LogOut,
  Bell, Menu, X, BarChart3, Award, MessageSquare, ClipboardList,
  TrendingUp, Home, CreditCard, Star
} from 'lucide-react';
import Logo from './Logo';
import { useAppStore } from '../lib/store';

interface NavItem { label: string; href: string; icon: React.ReactNode; }

const studentNav: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'My Courses', href: '/dashboard/courses', icon: <BookOpen className="w-4 h-4" /> },
  { label: 'Live Classes', href: '/dashboard/courses', icon: <BookOpen className="w-4 h-4" /> },
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

  { label: 'Requests', href: '/admin/requests', icon: <ClipboardList className="w-4 h-4" /> },
  { label: 'Payments', href: '/admin/payments', icon: <CreditCard className="w-4 h-4" /> },
  { label: 'Analytics', href: '/admin/analytics', icon: <BarChart3 className="w-4 h-4" /> },
  { label: 'Settings', href: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, logout } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = currentUser?.role === 'admin' ? adminNav : currentUser?.role === 'instructor' ? instructorNav : studentNav;
  const roleLabel = currentUser?.role === 'admin' ? 'Admin Panel' : currentUser?.role === 'instructor' ? 'Instructor Studio' : 'Student Portal';
  const roleColor = currentUser?.role === 'admin' ? '#f59e0b' : currentUser?.role === 'instructor' ? '#8b5cf6' : 'var(--orange)';

  const handleLogout = () => { logout(); navigate('/'); };
  const isActive = (href: string) => location.pathname === href;

  const SidebarContent = () => (
    <div className="flex flex-col h-full" style={{ background: 'var(--bg-sidebar)' }}>
      <div className="p-5 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <Link to="/" className="flex items-center gap-2 mb-4">
          <Logo size="sm" />
        </Link>
        <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-card)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${roleColor}, var(--orange-bright))` }}>
            {currentUser?.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{currentUser?.name}</p>
            <p className="text-xs" style={{ color: roleColor }}>{roleLabel}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map(item => (
          <Link key={item.href} to={item.href} onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive(item.href) ? 'sidebar-active' : 'sidebar-link'}`}>
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t space-y-0.5" style={{ borderColor: 'var(--border-color)' }}>
        <Link to="/" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium sidebar-link">
          <Home className="w-4 h-4" /> Back to Site
        </Link>
        <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-red-500/10" style={{ color: 'var(--red)' }}>
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col border-r flex-shrink-0" style={{ borderColor: 'var(--border-color)', width: '224px' }}>
        <SidebarContent />
      </div>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.div initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }} transition={{ type: 'spring', damping: 28 }}
              className="fixed left-0 top-0 bottom-0 z-50 md:hidden border-r" style={{ width: '240px', borderColor: 'var(--border-color)' }}>
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-4 sm:px-6 h-14 border-b flex-shrink-0"
          style={{ background: 'var(--bg-nav)', borderColor: 'var(--border-color)', backdropFilter: 'blur(12px)' }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden btn-ghost p-2 rounded-lg">
              <Menu className="w-4 h-4" />
            </button>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{roleLabel}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-ghost p-2 rounded-lg relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--red)' }} />
            </button>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ background: `linear-gradient(135deg, ${roleColor}, var(--orange-bright))` }}>
              {currentUser?.name.charAt(0)}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
