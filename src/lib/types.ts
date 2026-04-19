export type UserRole = 'student' | 'instructor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  isVerified: boolean;
  isApproved?: boolean;
  isSuspended?: boolean;
  createdAt: string;
  enrolledCourses?: string[];
  completedCourses?: string[];
  certificates?: Certificate[];
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
  isComingSoon?: boolean;
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
  type: 'video' | 'pdf' | 'quiz' | 'assignment' | 'slide';
  duration?: string;
  videoUrl?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  content?: string;
  order: number;
  isPreview: boolean;
  isDownloadable?: boolean;
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
  amountPaid?: number;
}

export interface LiveClass {
  id: string;
  courseId: string;
  instructorId: string;
  instructorName: string;
  title: string;
  description: string;
  scheduledAt: string;
  duration: number; // minutes
  status: 'scheduled' | 'live' | 'ended';
  roomName: string;   // Jitsi room name
  meetingUrl: string; // full Jitsi URL
  recordingUrl?: string;
  attendees?: string[];
  createdAt: string;
}

export interface PaymentRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseName: string;
  amountKobo: number;
  amountNgn: number;
  amountUsd: number;
  reference: string;
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
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt?: string;
}
