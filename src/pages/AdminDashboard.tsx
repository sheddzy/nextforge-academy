import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, BookOpen, BarChart3, TrendingUp, DollarSign, CheckCircle2,
  XCircle, AlertCircle, Eye, Trash2, Star, Shield, ClipboardList,
  UserCheck, UserX, Award, Activity, CreditCard, ArrowDownRight, Video
} from 'lucide-react';
import { formatNgn } from '../lib/paystack';
import LiveClassesView from '../components/LiveClassesView';
import { useAppStore } from '../lib/store';
import DashboardLayout from '../components/DashboardLayout';
import StatCard from '../components/StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444'];

function AdminHome() {
  const { users, courses, enrollments, courseRequests } = useAppStore();
  const students = users.filter(u => u.role === 'student');
  const instructors = users.filter(u => u.role === 'instructor');
  const published = courses.filter(c => c.isPublished && c.isApproved);
  const pending = courseRequests.filter(r => r.status === 'pending');

  const categoryData = ['Web Development', 'Data Science', 'DevOps', 'Design', 'Cybersecurity'].map(cat => ({
    name: cat.split(' ')[0],
    courses: courses.filter(c => c.category === cat).length,
    students: enrollments.filter(e => courses.find(c => c.id === e.courseId)?.category === cat).length,
  }));

  const enrollmentTrend = [
    { month: 'Jan', enrollments: 420 }, { month: 'Feb', enrollments: 680 },
    { month: 'Mar', enrollments: 890 }, { month: 'Apr', enrollments: 1200 },
    { month: 'May', enrollments: 1580 }, { month: 'Jun', enrollments: 2100 },
  ];

  const completionData = [
    { name: 'Completed', value: enrollments.filter(e => e.isCompleted).length },
    { name: 'In Progress', value: enrollments.filter(e => !e.isCompleted && e.progress > 0).length },
    { name: 'Not Started', value: enrollments.filter(e => e.progress === 0).length },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black mb-1" style={{ color: 'var(--text-primary)' }}>Admin Dashboard</h1>
        <p style={{ color: 'var(--text-muted)' }}>Platform overview and management</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Students" value={students.length.toLocaleString()} icon={<Users className="w-5 h-5" />} change="+12%" positive index={0} />
        <StatCard title="Total Courses" value={courses.length} icon={<BookOpen className="w-5 h-5" />} change="+5%" positive color="#22c55e" index={1} />
        <StatCard title="Revenue (Mock)" value="$48,290" icon={<DollarSign className="w-5 h-5" />} change="+23%" positive color="#f59e0b" index={2} />
        <StatCard title="Pending Requests" value={pending.length} icon={<ClipboardList className="w-5 h-5" />} color="#ef4444" index={3} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 rounded-2xl border p-6" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Enrollment Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={enrollmentTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px' }} />
              <Line type="monotone" dataKey="enrollments" stroke="var(--accent-primary)" strokeWidth={2} dot={{ fill: 'var(--accent-primary)' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border p-6" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Completion Rates</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={completionData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value">
                {completionData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {completionData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                <span style={{ color: 'var(--text-secondary)' }}>{d.name}</span>
                <span className="ml-auto font-semibold" style={{ color: 'var(--text-primary)' }}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border p-6" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Courses by Category</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
            <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
            <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px' }} />
            <Bar dataKey="courses" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="students" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function AdminUsers() {
  const { users, suspendUser, approveInstructor } = useAppStore();
  const [filter, setFilter] = useState<'all' | 'student' | 'instructor' | 'admin'>('all');
  const [search, setSearch] = useState('');

  const filtered = users.filter(u => {
    if (filter !== 'all' && u.role !== filter) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>User Management</h1>
        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{users.length} total users</span>
      </div>

      <div className="flex gap-3 mb-4 flex-wrap">
        {(['all', 'student', 'instructor', 'admin'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-4 py-2 rounded-full text-sm font-medium capitalize transition-all border"
            style={filter === f
              ? { background: 'var(--accent-primary)', color: 'white', borderColor: 'var(--accent-primary)' }
              : { borderColor: 'var(--border-color)', color: 'var(--text-secondary)', background: 'var(--bg-card)' }}>
            {f}
          </button>
        ))}
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..."
          className="px-4 py-2 rounded-xl border text-sm outline-none ml-auto"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
              {['User', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => (
              <tr key={user.id} className="border-b" style={{ borderColor: 'var(--border-color)' }}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ background: user.role === 'admin' ? '#f59e0b' : user.role === 'instructor' ? '#8b5cf6' : 'var(--accent-primary)' }}>
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{user.name}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold capitalize ${
                    user.role === 'admin' ? 'bg-yellow-500/15 text-yellow-500' :
                    user.role === 'instructor' ? 'bg-purple-500/15 text-purple-500' :
                    'bg-blue-500/15 text-blue-500'
                  }`}>{user.role}</span>
                </td>
                <td className="px-4 py-3">
                  {user.isSuspended
                    ? <span className="text-xs px-2 py-1 rounded-full bg-red-500/15 text-red-500">Suspended</span>
                    : user.role === 'instructor' && !user.isApproved
                      ? <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/15 text-yellow-500">Pending</span>
                      : <span className="text-xs px-2 py-1 rounded-full bg-green-500/15 text-green-500">Active</span>}
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {user.role === 'instructor' && !user.isApproved && (
                      <button onClick={() => approveInstructor(user.id)}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>
                        Approve
                      </button>
                    )}
                    {user.role !== 'admin' && (
                      <button onClick={() => suspendUser(user.id)}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium" style={{ background: user.isSuspended ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: user.isSuspended ? '#22c55e' : '#ef4444' }}>
                        {user.isSuspended ? 'Unsuspend' : 'Suspend'}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminCourses() {
  const { courses, approveCourse, featureCourse, deleteCourse, updateCourse } = useAppStore();
  const [editingPrice, setEditingPrice] = useState<Record<string, string>>({});
  const [priceSaved, setPriceSaved] = useState<Record<string, boolean>>({});
  const [orientationExpanded, setOrientationExpanded] = useState<Record<string, boolean>>({});
  const [orientationUrl, setOrientationUrl] = useState<Record<string, string>>({});
  const [orientationTitle, setOrientationTitle] = useState<Record<string, string>>({});
  const [orientationSaved, setOrientationSaved] = useState<Record<string, boolean>>({});

  const handleOrientationSave = (courseId: string) => {
    const url = orientationUrl[courseId]?.trim();
    const title = orientationTitle[courseId]?.trim();
    if (!url) return;
    updateCourse(courseId, {
      orientationVideoUrl: url,
      orientationVideoTitle: title || 'Course Orientation — Watch Before Starting',
    });
    setOrientationSaved(prev => ({ ...prev, [courseId]: true }));
    setTimeout(() => setOrientationSaved(prev => ({ ...prev, [courseId]: false })), 2500);
  };

  const handleOrientationRemove = (courseId: string) => {
    updateCourse(courseId, { orientationVideoUrl: undefined, orientationVideoTitle: undefined });
    setOrientationUrl(prev => { const n = { ...prev }; delete n[courseId]; return n; });
  };

  const handlePriceChange = (courseId: string, value: string) => {
    setEditingPrice(prev => ({ ...prev, [courseId]: value }));
  };

  const handlePriceSave = (courseId: string) => {
    const raw = editingPrice[courseId];
    if (raw === undefined || raw === '') return;
    const parsed = parseFloat(raw);
    if (isNaN(parsed) || parsed < 0) return;
    updateCourse(courseId, { price: parsed, isFree: parsed === 0 });
    setEditingPrice(prev => { const n = { ...prev }; delete n[courseId]; return n; });
    setPriceSaved(prev => ({ ...prev, [courseId]: true }));
    setTimeout(() => setPriceSaved(prev => ({ ...prev, [courseId]: false })), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>Course Management</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Only admins can set course pricing</p>
        </div>
        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{courses.length} total courses</span>
      </div>

      <div className="space-y-4">
        {courses.map(course => {
          const priceVal = editingPrice[course.id] ?? course.price.toString();
          const isDirty = editingPrice[course.id] !== undefined;
          return (
            <div key={course.id} className="rounded-2xl border overflow-hidden" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <div className="flex items-center gap-4 p-4">
                <img src={course.thumbnail} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" alt="" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{course.title}</h3>
                    {course.isFeatured && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>Featured</span>}
                  </div>
                  <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>by {course.instructorName} · {course.category}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${course.isApproved ? 'bg-green-500/15 text-green-500' : 'bg-yellow-500/15 text-yellow-500'}`}>
                      {course.isApproved ? 'Approved' : 'Pending Review'}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{course.enrolledCount} enrolled · ⭐ {course.rating}</span>
                  </div>
                </div>

                {/* Price Editor — Admin only */}
                <div className="flex items-center gap-2 flex-shrink-0 border-l pl-4" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="text-center">
                    <p className="text-xs font-semibold mb-1.5" style={{ color: 'var(--text-muted)' }}>PRICE (USD)</p>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold" style={{ color: 'var(--text-muted)' }}>$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={priceVal}
                        onChange={e => handlePriceChange(course.id, e.target.value)}
                        className="w-20 px-2 py-1.5 rounded-lg border text-sm font-bold text-center outline-none"
                        style={{
                          background: isDirty ? 'rgba(99,102,241,0.08)' : 'var(--bg-secondary)',
                          borderColor: isDirty ? 'var(--accent-primary)' : 'var(--border-color)',
                          color: 'var(--text-primary)',
                        }}
                      />
                      {isDirty && (
                        <button
                          onClick={() => handlePriceSave(course.id)}
                          className="text-xs px-2.5 py-1.5 rounded-lg font-bold"
                          style={{ background: 'var(--accent-primary)', color: 'white' }}>
                          Save
                        </button>
                      )}
                      {!isDirty && priceSaved[course.id] && (
                        <span className="text-xs font-semibold" style={{ color: '#22c55e' }}>✓</span>
                      )}
                    </div>
                    {parseFloat(priceVal) === 0 && (
                      <p className="text-xs mt-1" style={{ color: '#22c55e' }}>Free</p>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  {!course.isApproved && (
                    <button onClick={() => approveCourse(course.id)}
                      className="text-xs px-3 py-2 rounded-xl font-medium whitespace-nowrap" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>
                      Approve
                    </button>
                  )}
                  <button onClick={() => featureCourse(course.id, !course.isFeatured)}
                    className="text-xs px-3 py-2 rounded-xl font-medium whitespace-nowrap" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
                    {course.isFeatured ? 'Unfeature' : 'Feature'}
                  </button>
                  <button
                    onClick={() => setOrientationExpanded(prev => ({ ...prev, [course.id]: !prev[course.id] }))}
                    className="text-xs px-3 py-2 rounded-xl font-medium whitespace-nowrap"
                    style={{ background: course.orientationVideoUrl ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)', color: 'var(--accent-primary)', border: `1px solid ${course.orientationVideoUrl ? 'rgba(99,102,241,0.4)' : 'rgba(99,102,241,0.15)'}` }}>
                    🎬 {course.orientationVideoUrl ? 'Edit Orientation' : 'Add Orientation'}
                  </button>
                  <button onClick={() => { if (confirm('Delete this course?')) deleteCourse(course.id); }}
                    className="text-xs px-3 py-2 rounded-xl font-medium" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
                    Remove
                  </button>
                </div>
              </div>

              {/* Orientation Video Panel */}
              {orientationExpanded[course.id] && (
                <div className="border-t px-4 py-4 space-y-3" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>🎬 Orientation Video</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(238,122,61,0.15)', color: 'var(--accent-primary)' }}>
                      Shown to all students before they start
                    </span>
                  </div>
                  {course.orientationVideoUrl && (
                    <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-green-500">Orientation video set</p>
                        <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{course.orientationVideoTitle}</p>
                      </div>
                      <button onClick={() => handleOrientationRemove(course.id)} className="text-xs px-2 py-1 rounded-lg" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>Remove</button>
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Video Title</label>
                    <input
                      value={orientationTitle[course.id] ?? (course.orientationVideoTitle || '')}
                      onChange={e => setOrientationTitle(prev => ({ ...prev, [course.id]: e.target.value }))}
                      placeholder="e.g. Welcome to Project Management Mastery — Start Here"
                      className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                      style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Video URL <span style={{ color: 'var(--text-muted)' }}>(MP4, YouTube embed, Vimeo, etc.)</span></label>
                    <div className="flex gap-2">
                      <input
                        value={orientationUrl[course.id] ?? (course.orientationVideoUrl || '')}
                        onChange={e => setOrientationUrl(prev => ({ ...prev, [course.id]: e.target.value }))}
                        placeholder="https://your-cdn.com/orientation.mp4"
                        className="flex-1 px-3 py-2 rounded-xl border text-sm outline-none"
                        style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                      />
                      <button
                        onClick={() => handleOrientationSave(course.id)}
                        className="px-4 py-2 rounded-xl text-sm font-bold text-white whitespace-nowrap"
                        style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--orange-bright))' }}
                      >
                        {orientationSaved[course.id] ? '✓ Saved!' : 'Save'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AdminRequests() {
  const { courseRequests, reviewCourseRequest } = useAppStore();
  const [note, setNote] = useState<Record<string, string>>({});

  return (
    <div>
      <h1 className="text-2xl font-black mb-6" style={{ color: 'var(--text-primary)' }}>Instructor Course Requests</h1>
      <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
        Review requests from instructors who want to teach additional courses.
      </p>

      {courseRequests.length === 0 ? (
        <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>No requests yet.</div>
      ) : (
        <div className="space-y-4">
          {courseRequests.map(req => (
            <div key={req.id} className="rounded-2xl border p-6" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>{req.courseTitle}</h3>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>by {req.instructorName} · {req.category}</p>
                </div>
                <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${
                  req.status === 'approved' ? 'bg-green-500/15 text-green-500' :
                  req.status === 'rejected' ? 'bg-red-500/15 text-red-500' :
                  'bg-yellow-500/15 text-yellow-500'
                }`}>{req.status}</span>
              </div>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{req.courseDescription}</p>
              <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Submitted {new Date(req.submittedAt).toLocaleDateString()}</p>

              {req.status === 'pending' && (
                <div className="space-y-3">
                  <textarea
                    value={note[req.id] || ''}
                    onChange={e => setNote(n => ({ ...n, [req.id]: e.target.value }))}
                    placeholder="Add a note (optional)..."
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none"
                    style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  />
                  <div className="flex gap-3">
                    <button onClick={() => reviewCourseRequest(req.id, 'approved', note[req.id])}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>
                      <CheckCircle2 className="w-4 h-4" /> Approve
                    </button>
                    <button onClick={() => reviewCourseRequest(req.id, 'rejected', note[req.id])}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                </div>
              )}

              {req.adminNote && (
                <div className="mt-3 p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                  <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Admin Note:</p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{req.adminNote}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminAnalytics() {
  const { users, courses, enrollments } = useAppStore();
  const students = users.filter(u => u.role === 'student');
  const instructors = users.filter(u => u.role === 'instructor');
  const approved = courses.filter(c => c.isApproved);
  const completed = enrollments.filter(e => e.isCompleted);

  const topCourses = [...courses].sort((a, b) => b.enrolledCount - a.enrolledCount).slice(0, 5);
  const revenueData = [
    { month: 'Jan', revenue: 4200 }, { month: 'Feb', revenue: 6800 },
    { month: 'Mar', revenue: 8900 }, { month: 'Apr', revenue: 12000 },
    { month: 'May', revenue: 15800 }, { month: 'Jun', revenue: 21000 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-black mb-6" style={{ color: 'var(--text-primary)' }}>Analytics</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Students" value={students.length} icon={<Users className="w-5 h-5" />} index={0} />
        <StatCard title="Active Instructors" value={instructors.filter(i => i.isApproved).length} icon={<Award className="w-5 h-5" />} color="#8b5cf6" index={1} />
        <StatCard title="Published Courses" value={approved.length} icon={<BookOpen className="w-5 h-5" />} color="#22c55e" index={2} />
        <StatCard title="Completion Rate" value={`${enrollments.length > 0 ? Math.round((completed.length / enrollments.length) * 100) : 0}%`} icon={<Activity className="w-5 h-5" />} color="#f59e0b" index={3} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="rounded-2xl border p-6" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Revenue Trend (Mock)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <Tooltip formatter={(v) => [`$${v}`, 'Revenue']} contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px' }} />
              <Bar dataKey="revenue" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border p-6" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Top Courses by Enrollment</h3>
          <div className="space-y-3">
            {topCourses.map((course, i) => (
              <div key={course.id} className="flex items-center gap-3">
                <span className="text-sm font-bold w-5 text-center" style={{ color: 'var(--text-muted)' }}>{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{course.title}</p>
                  <div className="h-1.5 rounded-full mt-1" style={{ background: 'var(--bg-secondary)' }}>
                    <div className="h-full rounded-full" style={{ width: `${(course.enrolledCount / topCourses[0].enrolledCount) * 100}%`, background: COLORS[i] }} />
                  </div>
                </div>
                <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{course.enrolledCount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminPayments() {
  const { payments, courses, users } = useAppStore();
  const successPayments = payments.filter(p => p.status === 'success');
  const totalRevenueKobo = successPayments.reduce((acc, p) => acc + p.amountKobo, 0);
  const totalRevenueUsd = successPayments.reduce((acc, p) => acc + p.amountUsd, 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black mb-1" style={{ color: 'var(--text-primary)' }}>Payments</h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>All Paystack transactions on the platform</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Revenue" value={formatNgn(totalRevenueKobo)} icon={<DollarSign className="w-5 h-5" />} color="#22c55e" index={0} />
        <StatCard title="USD Equivalent" value={`$${totalRevenueUsd.toFixed(2)}`} icon={<TrendingUp className="w-5 h-5" />} color="#0ba4e0" index={1} />
        <StatCard title="Transactions" value={successPayments.length} icon={<CreditCard className="w-5 h-5" />} index={2} />
        <StatCard title="Avg. Order" value={successPayments.length > 0 ? formatNgn(Math.round(totalRevenueKobo / successPayments.length)) : '₦0'} icon={<ArrowDownRight className="w-5 h-5" />} color="#8b5cf6" index={3} />
      </div>

      {payments.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <CreditCard className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>No payments yet</h3>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Paystack transactions will appear here once students start enrolling</p>
        </div>
      ) : (
        <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                  {['Student', 'Course', 'Amount (NGN)', 'Amount (USD)', 'Reference', 'Status', 'Date'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...payments].reverse().map(payment => (
                  <tr key={payment.id} className="border-b" style={{ borderColor: 'var(--border-color)' }}>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{payment.studentName}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{payment.studentEmail}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm max-w-[180px] truncate" style={{ color: 'var(--text-secondary)' }}>{payment.courseName}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-sm" style={{ color: '#22c55e' }}>{formatNgn(payment.amountKobo)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>${payment.amountUsd}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs px-2 py-1 rounded-lg" style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>{payment.reference}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        payment.status === 'success' ? 'bg-green-500/15 text-green-500' :
                        payment.status === 'failed' ? 'bg-red-500/15 text-red-500' :
                        'bg-yellow-500/15 text-yellow-500'
                      }`}>{payment.status}</span>
                    </td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                      {new Date(payment.paidAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminSettings() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-black mb-6" style={{ color: 'var(--text-primary)' }}>Platform Settings</h1>
      <div className="space-y-4">
        {[
          { label: 'Platform Name', value: 'NextForge Academy' },
          { label: 'Domain', value: 'nextforgeacademy.online' },
          { label: 'Support Email', value: 'support@nextforgeacademy.online' },
          { label: 'Max Courses Per Instructor', value: '1 (expandable via request)' },
          { label: 'Payment Gateway', value: 'Paystack (NGN)' },
        ].map(setting => (
          <div key={setting.label} className="rounded-2xl border p-5" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>{setting.label}</label>
            <input defaultValue={setting.value}
              className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
          </div>
        ))}
        <button className="btn-primary px-6 py-3">Save Settings</button>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { isAuthenticated, currentUser } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || currentUser?.role !== 'admin') navigate('/login');
  }, [isAuthenticated, currentUser]);

  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<AdminHome />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="courses" element={<AdminCourses />} />
        <Route path="live" element={<div className="p-2"><LiveClassesView /></div>} />
        <Route path="requests" element={<AdminRequests />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="settings" element={<AdminSettings />} />
      </Routes>
    </DashboardLayout>
  );
}
