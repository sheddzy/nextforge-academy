import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Course, Enrollment, Certificate, CourseRequest, Announcement, PaymentRecord, Review, LiveClass, Lesson } from './types';
import { mockCourses, mockUsers, mockEnrollments, mockCourseRequests, mockReviews, mockLiveClasses } from './mockData';

interface RegisterData { name: string; email: string; password: string; role: 'student' | 'instructor'; }

interface AppState {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (data: RegisterData) => { success: boolean; error?: string };
  logout: () => void;

  users: User[];
  updateUser: (id: string, data: Partial<User>) => void;
  suspendUser: (id: string) => void;
  approveInstructor: (id: string) => void;

  courses: Course[];
  addCourse: (course: Course) => void;
  updateCourse: (id: string, data: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  approveCourse: (id: string) => void;
  featureCourse: (id: string, featured: boolean) => void;
  addLesson: (moduleId: string, courseId: string, lesson: Lesson) => void;
  updateLesson: (courseId: string, lessonId: string, data: Partial<Lesson>) => void;
  deleteLesson: (courseId: string, lessonId: string) => void;

  enrollments: Enrollment[];
  enrollInCourse: (courseId: string) => void;
  updateProgress: (enrollmentId: string, lessonId: string) => void;
  getEnrollment: (courseId: string) => Enrollment | undefined;

  certificates: Certificate[];
  issueCertificate: (courseId: string) => Certificate | null;

  courseRequests: CourseRequest[];
  submitCourseRequest: (data: Partial<CourseRequest>) => void;
  reviewCourseRequest: (id: string, status: 'approved' | 'rejected', note?: string) => void;

  announcements: Announcement[];
  addAnnouncement: (data: Partial<Announcement>) => void;

  payments: PaymentRecord[];
  recordPayment: (record: PaymentRecord) => void;
  enrollAfterPayment: (courseId: string, paymentRef: string, amountKobo: number) => void;

  reviews: Review[];
  submitReview: (courseId: string, rating: number, comment: string) => { success: boolean; error?: string };
  updateReview: (reviewId: string, rating: number, comment: string) => void;
  deleteReview: (reviewId: string) => void;
  getUserReview: (courseId: string) => Review | undefined;

  liveClasses: LiveClass[];
  scheduleLiveClass: (data: Partial<LiveClass>) => void;
  updateLiveClass: (id: string, data: Partial<LiveClass>) => void;
  deleteLiveClass: (id: string) => void;
  startLiveClass: (id: string) => void;
  endLiveClass: (id: string, recordingUrl?: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isAuthenticated: false,

      login: (email, password) => {
        const user = get().users.find(u => u.email === email);
        if (!user) return { success: false, error: 'No account found with this email.' };
        if (password !== 'password123' && password !== 'admin123') return { success: false, error: 'Invalid password.' };
        if (user.isSuspended) return { success: false, error: 'Your account has been suspended.' };
        set({ currentUser: user, isAuthenticated: true });
        return { success: true };
      },

      register: (data) => {
        if (get().users.find(u => u.email === data.email)) return { success: false, error: 'Email already registered.' };
        const newUser: User = {
          id: `user_${Date.now()}`, name: data.name, email: data.email, role: data.role,
          isVerified: true, isApproved: data.role === 'student', isSuspended: false,
          createdAt: new Date().toISOString(), enrolledCourses: [], completedCourses: [], certificates: [],
        };
        set(s => ({ users: [...s.users, newUser], currentUser: newUser, isAuthenticated: true }));
        return { success: true };
      },

      logout: () => set({ currentUser: null, isAuthenticated: false }),

      users: mockUsers,
      updateUser: (id, data) => set(s => ({
        users: s.users.map(u => u.id === id ? { ...u, ...data } : u),
        currentUser: s.currentUser?.id === id ? { ...s.currentUser, ...data } : s.currentUser,
      })),
      suspendUser: (id) => set(s => ({ users: s.users.map(u => u.id === id ? { ...u, isSuspended: !u.isSuspended } : u) })),
      approveInstructor: (id) => set(s => ({ users: s.users.map(u => u.id === id ? { ...u, isApproved: true } : u) })),

      courses: mockCourses,
      addCourse: (course) => set(s => ({ courses: [...s.courses, course] })),
      updateCourse: (id, data) => set(s => ({ courses: s.courses.map(c => c.id === id ? { ...c, ...data } : c) })),
      deleteCourse: (id) => set(s => ({ courses: s.courses.filter(c => c.id !== id) })),
      approveCourse: (id) => set(s => ({ courses: s.courses.map(c => c.id === id ? { ...c, isApproved: true, isPublished: true } : c) })),
      featureCourse: (id, featured) => set(s => ({ courses: s.courses.map(c => c.id === id ? { ...c, isFeatured: featured } : c) })),

      addLesson: (moduleId, courseId, lesson) => set(s => ({
        courses: s.courses.map(c => c.id === courseId ? {
          ...c,
          modules: c.modules.map(m => m.id === moduleId ? { ...m, lessons: [...m.lessons, lesson] } : m)
        } : c)
      })),
      updateLesson: (courseId, lessonId, data) => set(s => ({
        courses: s.courses.map(c => c.id === courseId ? {
          ...c,
          modules: c.modules.map(m => ({
            ...m,
            lessons: m.lessons.map(l => l.id === lessonId ? { ...l, ...data } : l)
          }))
        } : c)
      })),
      deleteLesson: (courseId, lessonId) => set(s => ({
        courses: s.courses.map(c => c.id === courseId ? {
          ...c,
          modules: c.modules.map(m => ({ ...m, lessons: m.lessons.filter(l => l.id !== lessonId) }))
        } : c)
      })),

      enrollments: mockEnrollments,
      enrollInCourse: (courseId) => {
        const user = get().currentUser;
        if (!user) return;
        if (get().enrollments.find(e => e.courseId === courseId && e.studentId === user.id)) return;
        set(s => ({ enrollments: [...s.enrollments, { id: `enroll_${Date.now()}`, studentId: user.id, courseId, enrolledAt: new Date().toISOString(), progress: 0, completedLessons: [], quizScores: {}, isCompleted: false }] }));
      },
      updateProgress: (enrollmentId, lessonId) => {
        const s = get();
        const enrollment = s.enrollments.find(e => e.id === enrollmentId);
        if (!enrollment || enrollment.completedLessons.includes(lessonId)) return;
        const course = s.courses.find(c => c.id === enrollment.courseId);
        if (!course) return;
        const total = course.modules.reduce((a, m) => a + m.lessons.length, 0);
        const newCompleted = [...enrollment.completedLessons, lessonId];
        const progress = Math.round((newCompleted.length / total) * 100);
        const isCompleted = progress === 100;
        set(s2 => ({ enrollments: s2.enrollments.map(e => e.id === enrollmentId ? { ...e, completedLessons: newCompleted, progress, isCompleted, completedAt: isCompleted ? new Date().toISOString() : e.completedAt, lastAccessedLesson: lessonId } : e) }));
        if (isCompleted) get().issueCertificate(enrollment.courseId);
      },
      getEnrollment: (courseId) => {
        const user = get().currentUser;
        if (!user) return undefined;
        return get().enrollments.find(e => e.courseId === courseId && e.studentId === user.id);
      },

      certificates: [],
      issueCertificate: (courseId) => {
        const user = get().currentUser;
        const course = get().courses.find(c => c.id === courseId);
        if (!user || !course) return null;
        const existing = get().certificates.find(c => c.courseId === courseId && c.studentId === user.id);
        if (existing) return existing;
        const cert: Certificate = { id: `cert_${Date.now()}`, studentId: user.id, studentName: user.name, courseId, courseName: course.title, issuedAt: new Date().toISOString(), certificateNumber: `NFA-${Date.now().toString(36).toUpperCase()}` };
        set(s => ({ certificates: [...s.certificates, cert] }));
        return cert;
      },

      courseRequests: mockCourseRequests,
      submitCourseRequest: (data) => {
        const user = get().currentUser;
        if (!user) return;
        set(s => ({ courseRequests: [...s.courseRequests, { id: `req_${Date.now()}`, instructorId: user.id, instructorName: user.name, courseTitle: data.courseTitle || '', courseDescription: data.courseDescription || '', category: data.category || '', status: 'pending', submittedAt: new Date().toISOString() }] }));
      },
      reviewCourseRequest: (id, status, note) => set(s => ({ courseRequests: s.courseRequests.map(r => r.id === id ? { ...r, status, adminNote: note, reviewedAt: new Date().toISOString() } : r) })),

      announcements: [],
      addAnnouncement: (data) => {
        const user = get().currentUser;
        if (!user) return;
        set(s => ({ announcements: [...s.announcements, { id: `ann_${Date.now()}`, courseId: data.courseId || '', instructorId: user.id, title: data.title || '', content: data.content || '', createdAt: new Date().toISOString() }] }));
      },

      payments: [],
      recordPayment: (record) => set(s => ({ payments: [...s.payments, record] })),
      enrollAfterPayment: (courseId, paymentRef, amountKobo) => {
        const user = get().currentUser;
        if (!user || get().enrollments.find(e => e.courseId === courseId && e.studentId === user.id)) return;
        set(s => ({ enrollments: [...s.enrollments, { id: `enroll_${Date.now()}`, studentId: user.id, courseId, enrolledAt: new Date().toISOString(), progress: 0, completedLessons: [], quizScores: {}, isCompleted: false, paymentRef, amountPaid: amountKobo }] }));
      },

      reviews: mockReviews,
      submitReview: (courseId, rating, comment) => {
        const user = get().currentUser;
        if (!user) return { success: false, error: 'Must be logged in.' };
        if (!get().enrollments.find(e => e.courseId === courseId && e.studentId === user.id)) return { success: false, error: 'Must be enrolled to review.' };
        if (get().reviews.find(r => r.courseId === courseId && r.studentId === user.id)) return { success: false, error: 'You have already reviewed this course.' };
        const review: Review = { id: `review_${Date.now()}`, courseId, studentId: user.id, studentName: user.name, rating, comment, createdAt: new Date().toISOString() };
        set(s => {
          const newReviews = [...s.reviews, review];
          const cr = newReviews.filter(r => r.courseId === courseId);
          const avg = parseFloat((cr.reduce((a, r) => a + r.rating, 0) / cr.length).toFixed(1));
          return { reviews: newReviews, courses: s.courses.map(c => c.id === courseId ? { ...c, rating: avg, reviewCount: cr.length } : c) };
        });
        return { success: true };
      },
      updateReview: (reviewId, rating, comment) => set(s => {
        const review = s.reviews.find(r => r.id === reviewId);
        if (!review) return s;
        const newReviews = s.reviews.map(r => r.id === reviewId ? { ...r, rating, comment, updatedAt: new Date().toISOString() } : r);
        const cr = newReviews.filter(r => r.courseId === review.courseId);
        const avg = parseFloat((cr.reduce((a, r) => a + r.rating, 0) / cr.length).toFixed(1));
        return { reviews: newReviews, courses: s.courses.map(c => c.id === review.courseId ? { ...c, rating: avg, reviewCount: cr.length } : c) };
      }),
      deleteReview: (reviewId) => set(s => {
        const review = s.reviews.find(r => r.id === reviewId);
        if (!review) return s;
        const newReviews = s.reviews.filter(r => r.id !== reviewId);
        const cr = newReviews.filter(r => r.courseId === review.courseId);
        const avg = cr.length > 0 ? parseFloat((cr.reduce((a, r) => a + r.rating, 0) / cr.length).toFixed(1)) : 0;
        return { reviews: newReviews, courses: s.courses.map(c => c.id === review.courseId ? { ...c, rating: avg, reviewCount: cr.length } : c) };
      }),
      getUserReview: (courseId) => {
        const user = get().currentUser;
        if (!user) return undefined;
        return get().reviews.find(r => r.courseId === courseId && r.studentId === user.id);
      },

      liveClasses: mockLiveClasses,
      scheduleLiveClass: (data) => {
        const user = get().currentUser;
        if (!user) return;
        const roomName = `NextForge-${data.title?.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '') || Date.now()}`;
        const lc: LiveClass = {
          id: `live_${Date.now()}`,
          courseId: data.courseId || '',
          instructorId: user.id,
          instructorName: user.name,
          title: data.title || '',
          description: data.description || '',
          scheduledAt: data.scheduledAt || new Date().toISOString(),
          duration: data.duration || 60,
          status: 'scheduled',
          roomName,
          meetingUrl: `https://meet.jit.si/${roomName}`,
          createdAt: new Date().toISOString(),
        };
        set(s => ({ liveClasses: [...s.liveClasses, lc] }));
      },
      updateLiveClass: (id, data) => set(s => ({ liveClasses: s.liveClasses.map(lc => lc.id === id ? { ...lc, ...data } : lc) })),
      deleteLiveClass: (id) => set(s => ({ liveClasses: s.liveClasses.filter(lc => lc.id !== id) })),
      startLiveClass: (id) => set(s => ({ liveClasses: s.liveClasses.map(lc => lc.id === id ? { ...lc, status: 'live' } : lc) })),
      endLiveClass: (id, recordingUrl) => set(s => ({ liveClasses: s.liveClasses.map(lc => lc.id === id ? { ...lc, status: 'ended', recordingUrl } : lc) })),
    }),
    { name: 'nextforge-lms-v3' }
  )
);
