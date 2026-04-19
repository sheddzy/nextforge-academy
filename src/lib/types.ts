export type UserRole = 'student' | 'instructor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  isVerified: boolean;
  isApproved?: boolean; // for instructors
  isSuspended?: boolean;
  createdAt: string;
  enrolledCourses?: string[];
  completedCourses?: string[];
  certificates?: Certificate[];
}

export interface Instructor extends User {
  role: 'instructor';
  expertise: string[];
  rating: number;
  totalStudents: number;
  courseCount: number;
  pendingCourseRequest?: CourseRequest;
  certifications?: string[];
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  thumbnail: string;
  instructorId: string;
  instructorName: string;
  instructorAvatar?: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: number;
  isFree: boolean;
  isFeatured: boolean;
  isPublished: boolean;
  isApproved: boolean;
  rating: number;
  reviewCount: number;
  enrolledCount: number;
  duration: string;
  modules: Module[];
  tags: string[];
  requirements: string[];
  whatYouLearn: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  type: 'video' | 'pdf' | 'quiz' | 'assignment';
  duration?: string;
  videoUrl?: string;
  content?: string;
  order: number;
  isPreview: boolean;
  quiz?: Quiz;
}

export interface Quiz {
  id: string;
  lessonId: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrolledAt: string;
  progress: number;
  completedLessons: string[];
  lastAccessedLesson?: string;
  quizScores: Record<string, number>;
  isCompleted: boolean;
  completedAt?: string;
  paymentRef?: string;
  amountPaid?: number; // in NGN kobo
}

export interface PaymentRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseName: string;
  amountKobo: number;   // NGN kobo
  amountNgn: number;    // NGN naira
  amountUsd: number;    // original USD price
  reference: string;    // Paystack reference
  status: 'success' | 'failed' | 'abandoned';
  paidAt: string;
}

export interface Certificate {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  issuedAt: string;
  certificateNumber: string;
}

export interface CourseRequest {
  id: string;
  instructorId: string;
  instructorName: string;
  courseTitle: string;
  courseDescription: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  adminNote?: string;
}

export interface Announcement {
  id: string;
  courseId: string;
  instructorId: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface Review {
  id: string;
  courseId: string;
  studentId: string;
  studentName: string;
  rating: number;        // 1–5
  comment: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}
