import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Course, Enrollment, Certificate, CourseRequest, Announcement, PaymentRecord, Review } from './types';
import { mockCourses, mockUsers, mockEnrollments, mockCourseRequests, mockReviews } from './mockData';

interface AppState {
  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (data: RegisterData) => { success: boolean; error?: string };
  logout: () => void;

  // Users
  users: User[];
  updateUser: (id: string, data: Partial<User>) => void;
  suspendUser: (id: string) => void;
  approveInstructor: (id: string) => void;

  // Courses
  courses: Course[];
  addCourse: (course: Course) => void;
  updateCourse: (id: string, data: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  approveCourse: (id: string) => void;
  featureCourse: (id: string, featured: boolean) => void;

  // Enrollments
  enrollments: Enrollment[];
  enrollInCourse: (courseId: string) => void;
  updateProgress: (enrollmentId: string, lessonId: string) => void;
  getEnrollment: (courseId: string) => Enrollment | undefined;

  // Certificates
  certificates: Certificate[];
  issueCertificate: (courseId: string) => Certificate | null;

  // Course Requests
  courseRequests: CourseRequest[];
  submitCourseRequest: (data: Partial<CourseRequest>) => void;
  reviewCourseRequest: (id: string, status: 'approved' | 'rejected', note?: string) => void;

  // Announcements
  announcements: Announcement[];
  addAnnouncement: (data: Partial<Announcement>) => void;

  // Payments
  payments: PaymentRecord[];
  recordPayment: (record: PaymentRecord) => void;
  enrollAfterPayment: (courseId: string, paymentRef: string, amountKobo: number) => void;

  // Reviews
  reviews: Review[];
  submitReview: (courseId: string, rating: number, comment: string) => { success: boolean; error?: string };
  updateReview: (reviewId: string, rating: number, comment: string) => void;
  deleteReview: (reviewId: string) => void;
  getUserReview: (courseId: string) => Review | undefined;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'instructor';
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isAuthenticated: false,

      login: (email, password) => {
        const users = get().users;
        const user = users.find(u => u.email === email);
        if (!user) return { success: false, error: 'No account found with this email.' };
        // Mock password check (in real app, compare hashed)
        if (password !== 'password123' && password !== 'admin123') {
          return { success: false, error: 'Invalid password.' };
        }
        if (user.isSuspended) return { success: false, error: 'Your account has been suspended.' };
        set({ currentUser: user, isAuthenticated: true });
        return { success: true };
      },

      register: (data) => {
        const users = get().users;
        if (users.find(u => u.email === data.email)) {
          return { success: false, error: 'Email already registered.' };
        }
        const newUser: User = {
          id: `user_${Date.now()}`,
          name: data.name,
          email: data.email,
          role: data.role,
          isVerified: true,
          isApproved: data.role === 'student' ? true : false,
          isSuspended: false,
          createdAt: new Date().toISOString(),
          enrolledCourses: [],
          completedCourses: [],
          certificates: [],
        };
        set(state => ({ users: [...state.users, newUser], currentUser: newUser, isAuthenticated: true }));
        return { success: true };
      },

      logout: () => set({ currentUser: null, isAuthenticated: false }),

      users: mockUsers,
      updateUser: (id, data) => set(state => ({
        users: state.users.map(u => u.id === id ? { ...u, ...data } : u),
        currentUser: state.currentUser?.id === id ? { ...state.currentUser, ...data } : state.currentUser,
      })),
      suspendUser: (id) => set(state => ({
        users: state.users.map(u => u.id === id ? { ...u, isSuspended: !u.isSuspended } : u),
      })),
      approveInstructor: (id) => set(state => ({
        users: state.users.map(u => u.id === id ? { ...u, isApproved: true } : u),
      })),

      courses: mockCourses,
      addCourse: (course) => set(state => ({ courses: [...state.courses, course] })),
      updateCourse: (id, data) => set(state => ({
        courses: state.courses.map(c => c.id === id ? { ...c, ...data } : c),
      })),
      deleteCourse: (id) => set(state => ({ courses: state.courses.filter(c => c.id !== id) })),
      approveCourse: (id) => set(state => ({
        courses: state.courses.map(c => c.id === id ? { ...c, isApproved: true, isPublished: true } : c),
      })),
      featureCourse: (id, featured) => set(state => ({
        courses: state.courses.map(c => c.id === id ? { ...c, isFeatured: featured } : c),
      })),

      enrollments: mockEnrollments,
      enrollInCourse: (courseId) => {
        const user = get().currentUser;
        if (!user) return;
        const existing = get().enrollments.find(e => e.courseId === courseId && e.studentId === user.id);
        if (existing) return;
        const enrollment: Enrollment = {
          id: `enroll_${Date.now()}`,
          studentId: user.id,
          courseId,
          enrolledAt: new Date().toISOString(),
          progress: 0,
          completedLessons: [],
          quizScores: {},
          isCompleted: false,
        };
        set(state => ({ enrollments: [...state.enrollments, enrollment] }));
      },
      updateProgress: (enrollmentId, lessonId) => {
        const state = get();
        const enrollment = state.enrollments.find(e => e.id === enrollmentId);
        if (!enrollment) return;
        if (enrollment.completedLessons.includes(lessonId)) return;
        const course = state.courses.find(c => c.id === enrollment.courseId);
        if (!course) return;
        const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
        const newCompleted = [...enrollment.completedLessons, lessonId];
        const progress = Math.round((newCompleted.length / totalLessons) * 100);
        const isCompleted = progress === 100;
        set(state => ({
          enrollments: state.enrollments.map(e =>
            e.id === enrollmentId
              ? { ...e, completedLessons: newCompleted, progress, isCompleted, completedAt: isCompleted ? new Date().toISOString() : e.completedAt, lastAccessedLesson: lessonId }
              : e
          ),
        }));
        if (isCompleted) {
          get().issueCertificate(enrollment.courseId);
        }
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
        const cert: Certificate = {
          id: `cert_${Date.now()}`,
          studentId: user.id,
          studentName: user.name,
          courseId,
          courseName: course.title,
          issuedAt: new Date().toISOString(),
          certificateNumber: `NFA-${Date.now().toString(36).toUpperCase()}`,
        };
        set(state => ({ certificates: [...state.certificates, cert] }));
        return cert;
      },

      courseRequests: mockCourseRequests,
      submitCourseRequest: (data) => {
        const user = get().currentUser;
        if (!user) return;
        const req: CourseRequest = {
          id: `req_${Date.now()}`,
          instructorId: user.id,
          instructorName: user.name,
          courseTitle: data.courseTitle || '',
          courseDescription: data.courseDescription || '',
          category: data.category || '',
          status: 'pending',
          submittedAt: new Date().toISOString(),
        };
        set(state => ({ courseRequests: [...state.courseRequests, req] }));
      },
      reviewCourseRequest: (id, status, note) => set(state => ({
        courseRequests: state.courseRequests.map(r =>
          r.id === id ? { ...r, status, adminNote: note, reviewedAt: new Date().toISOString() } : r
        ),
      })),

      announcements: [],
      addAnnouncement: (data) => {
        const user = get().currentUser;
        if (!user) return;
        const ann: Announcement = {
          id: `ann_${Date.now()}`,
          courseId: data.courseId || '',
          instructorId: user.id,
          title: data.title || '',
          content: data.content || '',
          createdAt: new Date().toISOString(),
        };
        set(state => ({ announcements: [...state.announcements, ann] }));
      },

      // Payments
      payments: [],
      recordPayment: (record) => set(state => ({ payments: [...state.payments, record] })),
      enrollAfterPayment: (courseId, paymentRef, amountKobo) => {
        const user = get().currentUser;
        if (!user) return;
        const existing = get().enrollments.find(e => e.courseId === courseId && e.studentId === user.id);
        if (existing) return;
        const enrollment: Enrollment = {
          id: `enroll_${Date.now()}`,
          studentId: user.id,
          courseId,
          enrolledAt: new Date().toISOString(),
          progress: 0,
          completedLessons: [],
          quizScores: {},
          isCompleted: false,
          paymentRef,
          amountPaid: amountKobo,
        };
        set(state => ({ enrollments: [...state.enrollments, enrollment] }));
      },

      // Reviews
      reviews: mockReviews,

      submitReview: (courseId, rating, comment) => {
        const user = get().currentUser;
        if (!user) return { success: false, error: 'You must be logged in.' };

        // Must be enrolled
        const enrolled = get().enrollments.find(e => e.courseId === courseId && e.studentId === user.id);
        if (!enrolled) return { success: false, error: 'You must be enrolled in this course to leave a review.' };

        // One review per student per course
        const existing = get().reviews.find(r => r.courseId === courseId && r.studentId === user.id);
        if (existing) return { success: false, error: 'You have already reviewed this course. Edit your existing review.' };

        const review: Review = {
          id: `review_${Date.now()}`,
          courseId,
          studentId: user.id,
          studentName: user.name,
          rating,
          comment,
          createdAt: new Date().toISOString(),
        };

        set(state => {
          const newReviews = [...state.reviews, review];
          // Recalculate course rating
          const courseReviews = newReviews.filter(r => r.courseId === courseId);
          const avgRating = parseFloat((courseReviews.reduce((a, r) => a + r.rating, 0) / courseReviews.length).toFixed(1));
          return {
            reviews: newReviews,
            courses: state.courses.map(c =>
              c.id === courseId ? { ...c, rating: avgRating, reviewCount: courseReviews.length } : c
            ),
          };
        });

        return { success: true };
      },

      updateReview: (reviewId, rating, comment) => {
        set(state => {
          const review = state.reviews.find(r => r.id === reviewId);
          if (!review) return state;
          const newReviews = state.reviews.map(r =>
            r.id === reviewId ? { ...r, rating, comment, updatedAt: new Date().toISOString() } : r
          );
          const courseReviews = newReviews.filter(r => r.courseId === review.courseId);
          const avgRating = parseFloat((courseReviews.reduce((a, r) => a + r.rating, 0) / courseReviews.length).toFixed(1));
          return {
            reviews: newReviews,
            courses: state.courses.map(c =>
              c.id === review.courseId ? { ...c, rating: avgRating, reviewCount: courseReviews.length } : c
            ),
          };
        });
      },

      deleteReview: (reviewId) => {
        set(state => {
          const review = state.reviews.find(r => r.id === reviewId);
          if (!review) return state;
          const newReviews = state.reviews.filter(r => r.id !== reviewId);
          const courseReviews = newReviews.filter(r => r.courseId === review.courseId);
          const avgRating = courseReviews.length > 0
            ? parseFloat((courseReviews.reduce((a, r) => a + r.rating, 0) / courseReviews.length).toFixed(1))
            : 0;
          return {
            reviews: newReviews,
            courses: state.courses.map(c =>
              c.id === review.courseId ? { ...c, rating: avgRating, reviewCount: courseReviews.length } : c
            ),
          };
        });
      },

      getUserReview: (courseId) => {
        const user = get().currentUser;
        if (!user) return undefined;
        return get().reviews.find(r => r.courseId === courseId && r.studentId === user.id);
      },
    }),
    { name: 'nextforge-lms' }
  )
);
