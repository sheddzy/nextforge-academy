import { useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Award, TrendingUp, Clock, Play, Download, CheckCircle2, BarChart3, CreditCard, Receipt } from 'lucide-react';
import { formatNgn } from '../lib/paystack';
import { useAppStore } from '../lib/store';
import DashboardLayout from '../components/DashboardLayout';
import CourseCard from '../components/CourseCard';
import StatCard from '../components/StatCard';

function StudentHome() {
  const { currentUser, courses, enrollments, certificates } = useAppStore();
  const myEnrollments = enrollments.filter(e => e.studentId === currentUser?.id);
  const myCourses = myEnrollments.map(e => ({
    course: courses.find(c => c.id === e.courseId),
    enrollment: e,
  })).filter(x => x.course);

  const totalCompleted = myEnrollments.filter(e => e.isCompleted).length;
  const avgProgress = myEnrollments.length > 0
    ? Math.round(myEnrollments.reduce((acc, e) => acc + e.progress, 0) / myEnrollments.length)
    : 0;
  const myCerts = certificates.filter(c => c.studentId === currentUser?.id);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black mb-1" style={{ color: 'var(--text-primary)' }}>
          Welcome back, {currentUser?.name.split(' ')[0]}! 👋
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Continue your learning journey</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Enrolled Courses" value={myEnrollments.length} icon={<BookOpen className="w-5 h-5" />} index={0} />
        <StatCard title="Completed" value={totalCompleted} icon={<CheckCircle2 className="w-5 h-5" />} color="#22c55e" index={1} />
        <StatCard title="Avg. Progress" value={`${avgProgress}%`} icon={<TrendingUp className="w-5 h-5" />} color="#f59e0b" index={2} />
        <StatCard title="Certificates" value={myCerts.length} icon={<Award className="w-5 h-5" />} color="#8b5cf6" index={3} />
      </div>

      <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Continue Learning</h2>
      {myCourses.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <BookOpen className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>No courses yet</h3>
          <p className="mb-4" style={{ color: 'var(--text-muted)' }}>Browse our catalog and enroll in your first course</p>
          <Link to="/courses" className="btn-primary px-6 py-2 inline-block">Browse Courses</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {myCourses.map(({ course, enrollment }, i) => course && (
            <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <CourseCard course={course} showProgress progress={enrollment.progress} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function StudentCourses() {
  const { currentUser, courses, enrollments } = useAppStore();
  const myEnrollments = enrollments.filter(e => e.studentId === currentUser?.id);
  const myCourses = myEnrollments.map(e => ({
    course: courses.find(c => c.id === e.courseId),
    enrollment: e,
  })).filter(x => x.course);

  return (
    <div>
      <h1 className="text-2xl font-black mb-6" style={{ color: 'var(--text-primary)' }}>My Courses</h1>
      {myCourses.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <p style={{ color: 'var(--text-muted)' }}>No courses enrolled yet.</p>
          <Link to="/courses" className="btn-primary px-6 py-2 inline-block mt-4">Browse Courses</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {myCourses.map(({ course, enrollment }) => course && (
            <CourseCard key={course.id} course={course} showProgress progress={enrollment.progress} />
          ))}
        </div>
      )}
    </div>
  );
}

function StudentCertificates() {
  const { currentUser, certificates, courses } = useAppStore();
  const myCerts = certificates.filter(c => c.studentId === currentUser?.id);

  return (
    <div>
      <h1 className="text-2xl font-black mb-6" style={{ color: 'var(--text-primary)' }}>My Certificates</h1>
      {myCerts.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <Award className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>No certificates yet</h3>
          <p style={{ color: 'var(--text-muted)' }}>Complete a course to earn your first certificate</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {myCerts.map(cert => (
            <motion.div key={cert.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border overflow-hidden" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              {/* Certificate Design */}
              <div className="p-8 text-center relative" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))' }}>
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg, var(--accent-primary) 0, var(--accent-primary) 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }} />
                <Award className="w-12 h-12 mx-auto mb-3" style={{ color: '#f59e0b' }} />
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Certificate of Completion</p>
                <h3 className="text-lg font-black mb-1" style={{ color: 'var(--text-primary)' }}>{cert.studentName}</h3>
                <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>has successfully completed</p>
                <h4 className="font-bold" style={{ color: 'var(--accent-primary)' }}>{cert.courseName}</h4>
              </div>
              <div className="p-4 flex items-center justify-between border-t" style={{ borderColor: 'var(--border-color)' }}>
                <div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Certificate ID: {cert.certificateNumber}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Issued: {new Date(cert.issuedAt).toLocaleDateString()}</p>
                </div>
                <button className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl" style={{ background: 'var(--accent-primary)', color: 'white' }}>
                  <Download className="w-4 h-4" /> Download
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function StudentProgress() {
  const { currentUser, courses, enrollments } = useAppStore();
  const myEnrollments = enrollments.filter(e => e.studentId === currentUser?.id);

  return (
    <div>
      <h1 className="text-2xl font-black mb-6" style={{ color: 'var(--text-primary)' }}>Learning Progress</h1>
      <div className="space-y-4">
        {myEnrollments.map(enrollment => {
          const course = courses.find(c => c.id === enrollment.courseId);
          if (!course) return null;
          const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
          return (
            <div key={enrollment.id} className="rounded-2xl border p-6" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img src={course.thumbnail} className="w-12 h-12 rounded-xl object-cover" alt="" />
                  <div>
                    <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{course.title}</h3>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Enrolled {new Date(enrollment.enrolledAt).toLocaleDateString()}</p>
                  </div>
                </div>
                {enrollment.isCompleted ? (
                  <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>Completed</span>
                ) : (
                  <Link to={`/learn/${course.id}`} className="btn-primary text-xs px-4 py-2 flex items-center gap-1">
                    <Play className="w-3 h-3" /> Continue
                  </Link>
                )}
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-1 h-2 rounded-full" style={{ background: 'var(--bg-secondary)' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${enrollment.progress}%`, background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))' }} />
                </div>
                <span className="text-sm font-bold" style={{ color: 'var(--accent-primary)' }}>{enrollment.progress}%</span>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {enrollment.completedLessons.length} of {totalLessons} lessons completed
              </p>
              {Object.keys(enrollment.quizScores).length > 0 && (
                <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
                  <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>Quiz Scores</p>
                  <div className="flex gap-2 flex-wrap">
                    {Object.entries(enrollment.quizScores).map(([qId, score]) => (
                      <span key={qId} className="text-xs px-2 py-1 rounded-lg font-semibold" style={{ background: score >= 70 ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: score >= 70 ? '#22c55e' : '#ef4444' }}>
                        {score}%
                      </span>
                    ))}
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

function StudentProfile() {
  const { currentUser, updateUser } = useAppStore();
  const [form, setForm] = useState({ name: currentUser?.name || '', bio: currentUser?.bio || '' });
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      updateUser(currentUser.id, form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-black mb-6" style={{ color: 'var(--text-primary)' }}>Profile Settings</h1>
      <div className="rounded-2xl border p-6" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-4 mb-6 pb-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-black" style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}>
            {currentUser?.name.charAt(0)}
          </div>
          <div>
            <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{currentUser?.name}</p>
            <p className="text-sm capitalize" style={{ color: 'var(--text-muted)' }}>{currentUser?.role} · {currentUser?.email}</p>
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
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Bio</label>
            <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} rows={4}
              className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
          </div>
          <button type="submit" className="btn-primary px-6 py-3 font-semibold">
            {saved ? '✓ Saved!' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

function StudentPayments() {
  const { currentUser, payments, courses } = useAppStore();
  const myPayments = payments.filter(p => p.studentId === currentUser?.id && p.status === 'success');
  const totalSpentKobo = myPayments.reduce((acc, p) => acc + p.amountKobo, 0);

  return (
    <div>
      <h1 className="text-2xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>Payment History</h1>
      <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>All your Paystack transactions on NextForge Academy</p>

      {myPayments.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="rounded-2xl border p-5" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>TOTAL SPENT</p>
            <p className="text-2xl font-black" style={{ color: '#22c55e' }}>{formatNgn(totalSpentKobo)}</p>
          </div>
          <div className="rounded-2xl border p-5" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>COURSES PURCHASED</p>
            <p className="text-2xl font-black" style={{ color: 'var(--accent-primary)' }}>{myPayments.length}</p>
          </div>
        </div>
      )}

      {myPayments.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <Receipt className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>No payments yet</h3>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Enroll in a paid course to see your transaction history here</p>
          <Link to="/courses" className="btn-primary px-6 py-2 inline-block">Browse Courses</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {[...myPayments].reverse().map(payment => {
            const course = courses.find(c => c.id === payment.courseId);
            return (
              <div key={payment.id} className="rounded-2xl border p-5" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                <div className="flex items-start gap-4">
                  {course && <img src={course.thumbnail} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" alt="" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{payment.courseName}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                          {new Date(payment.paidAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-black" style={{ color: '#22c55e' }}>{formatNgn(payment.amountKobo)}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>${payment.amountUsd} USD</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-green-500/15 text-green-500 font-semibold">✓ Paid via Paystack</span>
                      <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{payment.reference}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';

export default function StudentDashboard() {
  const { isAuthenticated, currentUser } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || currentUser?.role !== 'student') {
      navigate('/login');
    }
  }, [isAuthenticated, currentUser]);

  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<StudentHome />} />
        <Route path="courses" element={<StudentCourses />} />
        <Route path="certificates" element={<StudentCertificates />} />
        <Route path="progress" element={<StudentProgress />} />
        <Route path="payments" element={<StudentPayments />} />
        <Route path="profile" element={<StudentProfile />} />
      </Routes>
    </DashboardLayout>
  );
}
