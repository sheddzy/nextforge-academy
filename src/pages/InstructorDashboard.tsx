import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen, Users, TrendingUp, MessageSquare, Plus, Edit, Trash2,
  Send, Clock, CheckCircle2, XCircle, AlertCircle, Eye, Star
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import DashboardLayout from '../components/DashboardLayout';
import StatCard from '../components/StatCard';
import type { Course } from '../lib/types';

function InstructorHome() {
  const { currentUser, courses, enrollments, courseRequests } = useAppStore();
  const myCourses = courses.filter(c => c.instructorId === currentUser?.id);
  const myEnrollments = enrollments.filter(e => myCourses.some(c => c.id === e.courseId));
  const pendingRequest = courseRequests.find(r => r.instructorId === currentUser?.id && r.status === 'pending');

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black mb-1" style={{ color: 'var(--text-primary)' }}>
          Instructor Studio
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage your courses and students</p>
      </div>

      {!currentUser?.isApproved && (
        <div className="mb-6 p-4 rounded-xl flex items-center gap-3" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)' }}>
          <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#f59e0b' }} />
          <p className="text-sm" style={{ color: '#f59e0b' }}>Your instructor account is pending admin approval. You'll be notified once approved.</p>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="My Courses" value={myCourses.length} icon={<BookOpen className="w-5 h-5" />} index={0} />
        <StatCard title="Total Students" value={myEnrollments.length} icon={<Users className="w-5 h-5" />} color="#22c55e" index={1} />
        <StatCard title="Avg. Rating" value={myCourses.length > 0 ? (myCourses.reduce((a, c) => a + c.rating, 0) / myCourses.length).toFixed(1) : '—'} icon={<TrendingUp className="w-5 h-5" />} color="#f59e0b" index={2} />
        <StatCard title="Course Requests" value={courseRequests.filter(r => r.instructorId === currentUser?.id).length} icon={<MessageSquare className="w-5 h-5" />} color="#8b5cf6" index={3} />
      </div>

      {pendingRequest && (
        <div className="mb-6 p-4 rounded-xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4" style={{ color: '#f59e0b' }} />
            <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Pending Course Request</span>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>"{pendingRequest.courseTitle}" is awaiting admin approval.</p>
        </div>
      )}

      <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>My Courses</h2>
      {myCourses.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <BookOpen className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>No courses yet</h3>
          {currentUser?.isApproved
            ? <Link to="/instructor/course" className="btn-primary px-6 py-2 inline-block mt-2">Create Your Course</Link>
            : <p style={{ color: 'var(--text-muted)' }}>Awaiting admin approval</p>}
        </div>
      ) : (
        <div className="space-y-4">
          {myCourses.map(course => {
            const enrolled = enrollments.filter(e => e.courseId === course.id).length;
            return (
              <div key={course.id} className="flex items-center gap-4 p-4 rounded-2xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                <img src={course.thumbnail} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" alt="" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{course.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{enrolled} students</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${course.isApproved ? 'bg-green-500/15 text-green-500' : 'bg-yellow-500/15 text-yellow-500'}`}>
                      {course.isApproved ? 'Published' : 'Pending Approval'}
                    </span>
                  </div>
                </div>
                <Link to="/instructor/course" className="btn-secondary text-xs px-3 py-2">Manage</Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function InstructorCourse() {
  const { currentUser, courses, enrollments, addCourse, updateCourse } = useAppStore();
  const myCourse = courses.find(c => c.instructorId === currentUser?.id);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: myCourse?.title || '',
    description: myCourse?.description || '',
    category: myCourse?.category || 'Web Development',
    level: myCourse?.level || 'Beginner',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (myCourse) {
      updateCourse(myCourse.id, { title: form.title, description: form.description, category: form.category, level: form.level as any });
    }
    setEditing(false);
  };

  if (!myCourse) return (
    <div>
      <h1 className="text-2xl font-black mb-6" style={{ color: 'var(--text-primary)' }}>My Course</h1>
      <div className="text-center py-16 rounded-2xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        <BookOpen className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
        <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>No course created yet</h3>
        <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>As an instructor, you can create one course. Apply for additional courses.</p>
        {currentUser?.isApproved && (
          <button onClick={() => setEditing(true)} className="btn-primary px-6 py-2">Create Course</button>
        )}
      </div>
    </div>
  );

  const enrolled = enrollments.filter(e => e.courseId === myCourse.id);
  const avgProgress = enrolled.length > 0 ? Math.round(enrolled.reduce((a, e) => a + e.progress, 0) / enrolled.length) : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>My Course</h1>
        <button onClick={() => setEditing(!editing)} className="btn-secondary px-4 py-2 text-sm flex items-center gap-2">
          <Edit className="w-4 h-4" /> {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {editing ? (
        <form onSubmit={handleSave} className="rounded-2xl border p-6 space-y-4" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Course Title</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
              className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                {['Web Development', 'Data Science', 'DevOps', 'Design', 'Cybersecurity'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Level</label>
              <select value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value as 'Beginner' | 'Intermediate' | 'Advanced' }))}
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                {['Beginner', 'Intermediate', 'Advanced'].map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)' }}>
            <span className="text-lg">💰</span>
            <div>
              <p className="text-sm font-semibold" style={{ color: '#f59e0b' }}>Course pricing is set by the Admin</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Current price: <strong style={{ color: 'var(--text-primary)' }}>${myCourse?.price ?? 0}</strong> — Contact the admin to update pricing.</p>
            </div>
          </div>
          <button type="submit" className="btn-primary px-6 py-3">Save Changes</button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <img src={myCourse.thumbnail} className="w-full h-48 object-cover" alt="" />
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{myCourse.title}</h2>
                <span className={`text-xs px-3 py-1 rounded-full font-semibold ${myCourse.isApproved ? 'bg-green-500/15 text-green-500' : 'bg-yellow-500/15 text-yellow-500'}`}>
                  {myCourse.isApproved ? 'Published' : 'Pending Approval'}
                </span>
              </div>
              <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>{myCourse.description}</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                  <p className="text-xl font-black" style={{ color: 'var(--accent-primary)' }}>{enrolled.length}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Students</p>
                </div>
                <div className="text-center p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                  <p className="text-xl font-black" style={{ color: '#f59e0b' }}>{avgProgress}%</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Avg Progress</p>
                </div>
                <div className="text-center p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                  <p className="text-xl font-black" style={{ color: '#22c55e' }}>${myCourse.price}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Price (by Admin)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border p-6" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Course Modules ({myCourse.modules.length})</h3>
            <div className="space-y-3">
              {myCourse.modules.map((module, i) => (
                <div key={module.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: 'var(--accent-primary)' }}>{i + 1}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{module.title}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{module.lessons.length} lessons</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InstructorStudents() {
  const { currentUser, courses, enrollments, users } = useAppStore();
  const myCourses = courses.filter(c => c.instructorId === currentUser?.id);
  const myEnrollments = enrollments.filter(e => myCourses.some(c => c.id === e.courseId));

  return (
    <div>
      <h1 className="text-2xl font-black mb-6" style={{ color: 'var(--text-primary)' }}>Students</h1>
      {myEnrollments.length === 0 ? (
        <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>No students enrolled yet.</div>
      ) : (
        <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                {['Student', 'Course', 'Progress', 'Enrolled', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {myEnrollments.map(enrollment => {
                const student = users.find(u => u.id === enrollment.studentId);
                const course = courses.find(c => c.id === enrollment.courseId);
                return (
                  <tr key={enrollment.id} className="border-b" style={{ borderColor: 'var(--border-color)' }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}>
                          {student?.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{student?.name}</p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{student?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{course?.title.substring(0, 30)}...</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 rounded-full" style={{ background: 'var(--bg-secondary)' }}>
                          <div className="h-full rounded-full" style={{ width: `${enrollment.progress}%`, background: 'var(--accent-primary)' }} />
                        </div>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{enrollment.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>{new Date(enrollment.enrolledAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${enrollment.isCompleted ? 'bg-green-500/15 text-green-500' : 'bg-blue-500/15 text-blue-500'}`}>
                        {enrollment.isCompleted ? 'Completed' : 'In Progress'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function InstructorAnnouncements() {
  const { currentUser, courses, announcements, addAnnouncement } = useAppStore();
  const myCourse = courses.find(c => c.instructorId === currentUser?.id);
  const [form, setForm] = useState({ title: '', content: '' });
  const [sent, setSent] = useState(false);
  const myAnnouncements = announcements.filter(a => a.instructorId === currentUser?.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!myCourse) return;
    addAnnouncement({ ...form, courseId: myCourse.id });
    setForm({ title: '', content: '' });
    setSent(true);
    setTimeout(() => setSent(false), 2000);
  };

  return (
    <div>
      <h1 className="text-2xl font-black mb-6" style={{ color: 'var(--text-primary)' }}>Announcements</h1>
      {!myCourse ? (
        <p style={{ color: 'var(--text-muted)' }}>Create a course first to send announcements.</p>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border p-6" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <h2 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>New Announcement</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required
                placeholder="Announcement title"
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
              <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} required rows={5}
                placeholder="Write your message to students..."
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none"
                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
              <button type="submit" className="btn-primary px-6 py-3 flex items-center gap-2">
                <Send className="w-4 h-4" /> {sent ? 'Sent!' : 'Send Announcement'}
              </button>
            </form>
          </div>
          <div>
            <h2 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Previous Announcements</h2>
            {myAnnouncements.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No announcements sent yet.</p>
            ) : (
              <div className="space-y-3">
                {myAnnouncements.map(ann => (
                  <div key={ann.id} className="p-4 rounded-xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                    <p className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{ann.title}</p>
                    <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>{ann.content}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{new Date(ann.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function InstructorRequest() {
  const { currentUser, courses, courseRequests, submitCourseRequest } = useAppStore();
  const myCourse = courses.find(c => c.instructorId === currentUser?.id);
  const myRequests = courseRequests.filter(r => r.instructorId === currentUser?.id);
  const pendingRequest = myRequests.find(r => r.status === 'pending');
  const [form, setForm] = useState({ courseTitle: '', courseDescription: '', category: 'Web Development' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitCourseRequest(form);
    setForm({ courseTitle: '', courseDescription: '', category: 'Web Development' });
    setSubmitted(true);
  };

  return (
    <div>
      <h1 className="text-2xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>Additional Course Request</h1>
      <p className="mb-6 text-sm" style={{ color: 'var(--text-muted)' }}>
        Instructors can teach one course by default. Apply here to teach an additional course.
      </p>

      {!myCourse && (
        <div className="mb-6 p-4 rounded-xl" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)' }}>
          <p className="text-sm" style={{ color: '#f59e0b' }}>You need to have an existing course before requesting an additional one.</p>
        </div>
      )}

      {submitted && (
        <div className="mb-6 p-4 rounded-xl" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
          <p className="text-sm" style={{ color: '#22c55e' }}>✓ Request submitted! Admin will review within 2-3 business days.</p>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border p-6" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <h2 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Submit Request</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Proposed Course Title</label>
              <input value={form.courseTitle} onChange={e => setForm(f => ({ ...f, courseTitle: e.target.value }))} required
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                {['Web Development', 'Data Science', 'DevOps', 'Design', 'Cybersecurity'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Course Description</label>
              <textarea value={form.courseDescription} onChange={e => setForm(f => ({ ...f, courseDescription: e.target.value }))} required rows={4}
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none"
                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
            </div>
            <button type="submit" disabled={!!pendingRequest} className="btn-primary px-6 py-3 disabled:opacity-50">
              {pendingRequest ? 'Request Pending...' : 'Submit Request'}
            </button>
          </form>
        </div>

        <div>
          <h2 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Request History</h2>
          {myRequests.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No requests submitted yet.</p>
          ) : (
            <div className="space-y-3">
              {myRequests.map(req => (
                <div key={req.id} className="p-4 rounded-xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{req.courseTitle}</p>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      req.status === 'approved' ? 'bg-green-500/15 text-green-500' :
                      req.status === 'rejected' ? 'bg-red-500/15 text-red-500' :
                      'bg-yellow-500/15 text-yellow-500'
                    }`}>{req.status}</span>
                  </div>
                  <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>{req.category}</p>
                  {req.adminNote && <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Note: {req.adminNote}</p>}
                  <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>Submitted {new Date(req.submittedAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InstructorProfile() {
  const { currentUser, updateUser } = useAppStore();
  const [form, setForm] = useState({ name: currentUser?.name || '', bio: currentUser?.bio || '' });
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) { updateUser(currentUser.id, form); setSaved(true); setTimeout(() => setSaved(false), 2000); }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-black mb-6" style={{ color: 'var(--text-primary)' }}>Instructor Profile</h1>
      <div className="rounded-2xl border p-6" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-4 mb-6 pb-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-black" style={{ background: 'linear-gradient(135deg, #8b5cf6, var(--accent-secondary))' }}>
            {currentUser?.name.charAt(0)}
          </div>
          <div>
            <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{currentUser?.name}</p>
            <p className="text-sm" style={{ color: '#8b5cf6' }}>Instructor · {currentUser?.isApproved ? 'Approved' : 'Pending Approval'}</p>
          </div>
        </div>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Professional Bio</label>
            <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} rows={4}
              className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
          </div>
          <button type="submit" className="btn-primary px-6 py-3">{saved ? '✓ Saved!' : 'Save Changes'}</button>
        </form>
      </div>
    </div>
  );
}

function InstructorReviews() {
  const { currentUser, courses, reviews } = useAppStore();
  const myCourse = courses.find(c => c.instructorId === currentUser?.id);
  const courseReviews = myCourse ? reviews.filter(r => r.courseId === myCourse.id) : [];
  const avgRating = courseReviews.length > 0
    ? (courseReviews.reduce((a, r) => a + r.rating, 0) / courseReviews.length).toFixed(1)
    : '—';
  const breakdown = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: courseReviews.filter(r => r.rating === star).length,
  }));

  return (
    <div>
      <h1 className="text-2xl font-black mb-6" style={{ color: 'var(--text-primary)' }}>Course Reviews</h1>

      {!myCourse ? (
        <p style={{ color: 'var(--text-muted)' }}>No course yet — create a course to start receiving reviews.</p>
      ) : courseReviews.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <Star className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>No reviews yet</h3>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Reviews will appear here once enrolled students rate your course.</p>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <div className="rounded-2xl border p-5 text-center" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <p className="text-4xl font-black mb-1" style={{ color: '#f59e0b' }}>{avgRating}</p>
              <div className="flex justify-center gap-0.5 mb-1">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`w-4 h-4 ${i <= Math.round(parseFloat(avgRating as string)) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`} />
                ))}
              </div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Average Rating</p>
            </div>
            <div className="rounded-2xl border p-5 text-center" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <p className="text-4xl font-black mb-1" style={{ color: 'var(--accent-primary)' }}>{courseReviews.length}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Total Reviews</p>
            </div>
            <div className="rounded-2xl border p-5" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <div className="space-y-1.5">
                {breakdown.map(({ star, count }) => (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-xs w-4 text-right" style={{ color: 'var(--text-muted)' }}>{star}</span>
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                      <div className="h-full rounded-full bg-yellow-400" style={{ width: `${courseReviews.length > 0 ? (count / courseReviews.length) * 100 : 0}%` }} />
                    </div>
                    <span className="text-xs w-4" style={{ color: 'var(--text-muted)' }}>{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews list */}
          <div className="space-y-4">
            {[...courseReviews].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(review => (
              <div key={review.id} className="rounded-2xl border p-5" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                      style={{ background: `hsl(${review.studentName.charCodeAt(0) * 15 % 360}, 60%, 50%)` }}>
                      {review.studentName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{review.studentName}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {new Date(review.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className={`w-4 h-4 ${i <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{review.comment}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function InstructorDashboard() {
  const { isAuthenticated, currentUser } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || currentUser?.role !== 'instructor') navigate('/login');
  }, [isAuthenticated, currentUser]);

  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<InstructorHome />} />
        <Route path="course" element={<InstructorCourse />} />
        <Route path="students" element={<InstructorStudents />} />
        <Route path="reviews" element={<InstructorReviews />} />
        <Route path="announcements" element={<InstructorAnnouncements />} />
        <Route path="request" element={<InstructorRequest />} />
        <Route path="profile" element={<InstructorProfile />} />
      </Routes>
    </DashboardLayout>
  );
}
