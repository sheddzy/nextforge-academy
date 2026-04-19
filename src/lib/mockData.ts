import type { User, Course, Enrollment, CourseRequest, Review, LiveClass } from './types';

export const mockUsers: User[] = [
  {
    id: 'admin_1',
    name: 'Alex Morgan',
    email: 'admin@nextforgeacademy.online',
    role: 'admin',
    isVerified: true, isApproved: true, isSuspended: false,
    createdAt: '2024-01-01T00:00:00Z',
    bio: 'Platform Administrator',
    enrolledCourses: [], completedCourses: [], certificates: [],
  },
  {
    id: 'instructor_1',
    name: 'Dr. Sarah Chen',
    email: 'sarah@nextforgeacademy.online',
    role: 'instructor',
    isVerified: true, isApproved: true, isSuspended: false,
    createdAt: '2024-01-15T00:00:00Z',
    bio: 'Certified Project Management Professional (PMP) with 12+ years leading cross-functional teams at Fortune 500 companies.',
    enrolledCourses: [], completedCourses: [], certificates: [],
  },
  {
    id: 'instructor_2',
    name: 'Marcus Johnson',
    email: 'marcus@nextforgeacademy.online',
    role: 'instructor',
    isVerified: true, isApproved: true, isSuspended: false,
    createdAt: '2024-02-01T00:00:00Z',
    bio: 'Notion Certified Consultant & Productivity Expert. Helped 200+ businesses build their operating systems in Notion.',
    enrolledCourses: [], completedCourses: [], certificates: [],
  },
  {
    id: 'instructor_3',
    name: 'Priya Patel',
    email: 'priya@nextforgeacademy.online',
    role: 'instructor',
    isVerified: true, isApproved: false, isSuspended: false,
    createdAt: '2024-03-01T00:00:00Z',
    bio: 'Operations Director with expertise in process design, SOP creation, and scaling business operations.',
    enrolledCourses: [], completedCourses: [], certificates: [],
  },
  {
    id: 'student_1',
    name: 'Jordan Lee',
    email: 'student@nextforgeacademy.online',
    role: 'student',
    isVerified: true, isApproved: true, isSuspended: false,
    createdAt: '2024-02-10T00:00:00Z',
    bio: 'Aspiring project manager',
    enrolledCourses: ['course_1', 'course_2'],
    completedCourses: [], certificates: [],
  },
  {
    id: 'student_2',
    name: 'Emma Wilson',
    email: 'emma@example.com',
    role: 'student',
    isVerified: true, isApproved: true, isSuspended: false,
    createdAt: '2024-02-20T00:00:00Z',
    enrolledCourses: ['course_1'], completedCourses: [], certificates: [],
  },
  {
    id: 'student_3',
    name: 'Carlos Rivera',
    email: 'carlos@example.com',
    role: 'student',
    isVerified: true, isApproved: true, isSuspended: false,
    createdAt: '2024-03-05T00:00:00Z',
    enrolledCourses: ['course_2', 'course_3'], completedCourses: [], certificates: [],
  },
];

// Shared orientation video (same demo video for all courses — replace with real URLs)
const ORIENTATION_VIDEO = 'https://www.w3schools.com/html/mov_bbb.mp4';

export const mockCourses: Course[] = [
  // ─── Course 1: Project Management ────────────────────────────────────────────
  {
    id: 'course_1',
    title: 'Project Management Mastery',
    slug: 'project-management-mastery',
    description: 'Master the complete project lifecycle from initiation to closure. PMP exam prep included.',
    longDescription: 'This comprehensive project management course takes you from zero to professional PM. You will learn industry-standard frameworks (PMI, PRINCE2, Agile/Scrum), tools like Asana and Jira, risk management, stakeholder communication, and real-world project delivery. Fully aligned with PMP certification requirements.',
    thumbnail: '/images/course-pm.jpg',
    instructorId: 'instructor_1',
    instructorName: 'Dr. Sarah Chen',
    category: 'Project Management',
    level: 'Beginner',
    price: 89.99,
    isFree: false,
    isFeatured: true,
    isPublished: true,
    isApproved: true,
    isComingSoon: false,
    rating: 4.9,
    reviewCount: 1243,
    enrolledCount: 8750,
    duration: '38 hours',
    tags: ['PMP', 'Agile', 'Scrum', 'Risk Management', 'Stakeholder Management', 'PRINCE2'],
    requirements: ['No prior experience needed', 'Willingness to learn', 'Computer with internet access'],
    whatYouLearn: [
      'Manage projects using PMI & PRINCE2 frameworks',
      'Plan, execute, monitor and close projects',
      'Build and lead high-performing project teams',
      'Identify and mitigate project risks',
      'Create professional project documentation',
      'Prepare for PMP certification exam',
    ],
    orientationVideoUrl: ORIENTATION_VIDEO,
    orientationVideoTitle: 'Welcome to Project Management Mastery — Start Here',
    modules: [
      {
        id: 'pm_mod_1', courseId: 'course_1', title: 'Project Management Foundations', order: 1,
        lessons: [
          { id: 'pm_l1', moduleId: 'pm_mod_1', title: 'What is Project Management?', type: 'video', duration: '15:20', isPreview: true, isDownloadable: false, order: 1, videoUrl: ORIENTATION_VIDEO },
          { id: 'pm_l2', moduleId: 'pm_mod_1', title: 'The Project Lifecycle', type: 'video', duration: '22:10', isPreview: true, isDownloadable: false, order: 2, videoUrl: ORIENTATION_VIDEO },
          { id: 'pm_l3', moduleId: 'pm_mod_1', title: 'Key PM Frameworks Overview', type: 'video', duration: '28:45', isPreview: false, isDownloadable: false, order: 3, videoUrl: ORIENTATION_VIDEO },
          { id: 'pm_l4', moduleId: 'pm_mod_1', title: 'PM Foundations Slides', type: 'slide', isPreview: false, isDownloadable: true, order: 4, fileName: 'pm-foundations.pdf', fileSize: '3.2 MB', fileUrl: '#' },
          { id: 'pm_l5', moduleId: 'pm_mod_1', title: 'Foundations Quiz', type: 'quiz', isPreview: false, isDownloadable: false, order: 5, quiz: { id: 'pmq1', lessonId: 'pm_l5', questions: [{ id: 'pmqq1', question: 'What are the 5 phases of the project lifecycle?', options: ['Initiation, Planning, Execution, Monitoring, Closure', 'Start, Middle, End, Review, Archive', 'Design, Build, Test, Deploy, Maintain', 'Scope, Time, Cost, Quality, Risk'], correctIndex: 0 }, { id: 'pmqq2', question: 'What does PMP stand for?', options: ['Project Management Professional', 'Project Master Plan', 'Professional Management Process', 'Project Milestone Plan'], correctIndex: 0 }] } },
        ],
      },
      {
        id: 'pm_mod_2', courseId: 'course_1', title: 'Project Planning & Scope', order: 2,
        lessons: [
          { id: 'pm_l6', moduleId: 'pm_mod_2', title: 'Defining Project Scope', type: 'video', duration: '32:00', isPreview: false, isDownloadable: false, order: 1, videoUrl: ORIENTATION_VIDEO },
          { id: 'pm_l7', moduleId: 'pm_mod_2', title: 'Work Breakdown Structure (WBS)', type: 'video', duration: '38:15', isPreview: false, isDownloadable: false, order: 2, videoUrl: ORIENTATION_VIDEO },
          { id: 'pm_l8', moduleId: 'pm_mod_2', title: 'Creating a Project Schedule', type: 'video', duration: '45:30', isPreview: false, isDownloadable: false, order: 3, videoUrl: ORIENTATION_VIDEO },
          { id: 'pm_l9', moduleId: 'pm_mod_2', title: 'WBS Template', type: 'pdf', isPreview: false, isDownloadable: true, order: 4, fileName: 'wbs-template.pdf', fileSize: '1.5 MB', fileUrl: '#' },
          { id: 'pm_l10', moduleId: 'pm_mod_2', title: 'Create Your Project Plan (Assignment)', type: 'assignment', isPreview: false, isDownloadable: false, order: 5 },
        ],
      },
      {
        id: 'pm_mod_3', courseId: 'course_1', title: 'Risk & Stakeholder Management', order: 3,
        lessons: [
          { id: 'pm_l11', moduleId: 'pm_mod_3', title: 'Identifying & Assessing Risks', type: 'video', duration: '28:00', isPreview: false, isDownloadable: false, order: 1, videoUrl: ORIENTATION_VIDEO },
          { id: 'pm_l12', moduleId: 'pm_mod_3', title: 'Risk Response Strategies', type: 'video', duration: '24:45', isPreview: false, isDownloadable: false, order: 2, videoUrl: ORIENTATION_VIDEO },
          { id: 'pm_l13', moduleId: 'pm_mod_3', title: 'Stakeholder Analysis & Communication', type: 'video', duration: '35:20', isPreview: false, isDownloadable: false, order: 3, videoUrl: ORIENTATION_VIDEO },
          { id: 'pm_l14', moduleId: 'pm_mod_3', title: 'Risk Register Template', type: 'pdf', isPreview: false, isDownloadable: true, order: 4, fileName: 'risk-register.pdf', fileSize: '980 KB', fileUrl: '#' },
        ],
      },
      {
        id: 'pm_mod_4', courseId: 'course_1', title: 'Agile & Scrum', order: 4,
        lessons: [
          { id: 'pm_l15', moduleId: 'pm_mod_4', title: 'Agile Manifesto & Principles', type: 'video', duration: '20:00', isPreview: false, isDownloadable: false, order: 1, videoUrl: ORIENTATION_VIDEO },
          { id: 'pm_l16', moduleId: 'pm_mod_4', title: 'Scrum Framework Deep Dive', type: 'video', duration: '42:00', isPreview: false, isDownloadable: false, order: 2, videoUrl: ORIENTATION_VIDEO },
          { id: 'pm_l17', moduleId: 'pm_mod_4', title: 'Running Sprints & Retrospectives', type: 'video', duration: '38:00', isPreview: false, isDownloadable: false, order: 3, videoUrl: ORIENTATION_VIDEO },
          { id: 'pm_l18', moduleId: 'pm_mod_4', title: 'Agile vs Traditional PM Quiz', type: 'quiz', isPreview: false, isDownloadable: false, order: 4, quiz: { id: 'pmq2', lessonId: 'pm_l18', questions: [{ id: 'pmqq3', question: 'What is a Sprint in Scrum?', options: ['A time-boxed iteration of work', 'A project kickoff meeting', 'A risk assessment session', 'A stakeholder review'], correctIndex: 0 }] } },
        ],
      },
    ],
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z',
  },

  // ─── Course 2: Notion Mastery ─────────────────────────────────────────────
  {
    id: 'course_2',
    title: 'Notion Mastery: Build Your Second Brain',
    slug: 'notion-mastery',
    description: 'Go from Notion beginner to power user. Build a complete personal & business operating system.',
    longDescription: 'Master Notion from the ground up. This course covers everything from basic pages and databases to advanced automations, team workspaces, and building a full business OS. Whether you are a freelancer, startup, or enterprise team — this course transforms how you work.',
    thumbnail: '/images/course-notion.jpg',
    instructorId: 'instructor_2',
    instructorName: 'Marcus Johnson',
    category: 'Productivity',
    level: 'Beginner',
    price: 74.99,
    isFree: false,
    isFeatured: true,
    isPublished: true,
    isApproved: true,
    isComingSoon: false,
    rating: 4.8,
    reviewCount: 987,
    enrolledCount: 6420,
    duration: '24 hours',
    tags: ['Notion', 'Productivity', 'PKM', 'Second Brain', 'Databases', 'Automation'],
    requirements: ['Free Notion account', 'No prior Notion experience needed', 'Desire to get organised'],
    whatYouLearn: [
      'Navigate Notion like a power user',
      'Build linked databases and relational systems',
      'Create a personal knowledge management system',
      'Design a complete business operating system',
      'Automate workflows with Notion automations',
      'Build team wikis and project trackers',
    ],
    orientationVideoUrl: ORIENTATION_VIDEO,
    orientationVideoTitle: 'Welcome to Notion Mastery — Your Journey Starts Here',
    modules: [
      {
        id: 'no_mod_1', courseId: 'course_2', title: 'Notion Fundamentals', order: 1,
        lessons: [
          { id: 'no_l1', moduleId: 'no_mod_1', title: 'Notion Interface Tour', type: 'video', duration: '18:00', isPreview: true, isDownloadable: false, order: 1, videoUrl: ORIENTATION_VIDEO },
          { id: 'no_l2', moduleId: 'no_mod_1', title: 'Pages, Blocks & Hierarchy', type: 'video', duration: '25:30', isPreview: true, isDownloadable: false, order: 2, videoUrl: ORIENTATION_VIDEO },
          { id: 'no_l3', moduleId: 'no_mod_1', title: 'Text, Media & Embed Blocks', type: 'video', duration: '20:15', isPreview: false, isDownloadable: false, order: 3, videoUrl: ORIENTATION_VIDEO },
          { id: 'no_l4', moduleId: 'no_mod_1', title: 'Notion Starter Templates', type: 'pdf', isPreview: false, isDownloadable: true, order: 4, fileName: 'notion-starter-pack.pdf', fileSize: '2.1 MB', fileUrl: '#' },
          { id: 'no_l5', moduleId: 'no_mod_1', title: 'Fundamentals Quiz', type: 'quiz', isPreview: false, isDownloadable: false, order: 5, quiz: { id: 'noq1', lessonId: 'no_l5', questions: [{ id: 'noqq1', question: 'What is the basic building block in Notion?', options: ['A Block', 'A Cell', 'A Widget', 'A Module'], correctIndex: 0 }, { id: 'noqq2', question: 'Which view shows data in rows and columns?', options: ['Gallery', 'Board', 'Table', 'Timeline'], correctIndex: 2 }] } },
        ],
      },
      {
        id: 'no_mod_2', courseId: 'course_2', title: 'Databases & Views', order: 2,
        lessons: [
          { id: 'no_l6', moduleId: 'no_mod_2', title: 'Introduction to Databases', type: 'video', duration: '30:00', isPreview: false, isDownloadable: false, order: 1, videoUrl: ORIENTATION_VIDEO },
          { id: 'no_l7', moduleId: 'no_mod_2', title: 'Table, Board, Calendar & Gallery Views', type: 'video', duration: '38:20', isPreview: false, isDownloadable: false, order: 2, videoUrl: ORIENTATION_VIDEO },
          { id: 'no_l8', moduleId: 'no_mod_2', title: 'Filters, Sorts & Grouping', type: 'video', duration: '28:45', isPreview: false, isDownloadable: false, order: 3, videoUrl: ORIENTATION_VIDEO },
          { id: 'no_l9', moduleId: 'no_mod_2', title: 'Relations & Rollups', type: 'video', duration: '42:10', isPreview: false, isDownloadable: false, order: 4, videoUrl: ORIENTATION_VIDEO },
          { id: 'no_l10', moduleId: 'no_mod_2', title: 'Build a Project Tracker (Assignment)', type: 'assignment', isPreview: false, isDownloadable: false, order: 5 },
        ],
      },
      {
        id: 'no_mod_3', courseId: 'course_2', title: 'Personal Knowledge System', order: 3,
        lessons: [
          { id: 'no_l11', moduleId: 'no_mod_3', title: 'The PARA Method in Notion', type: 'video', duration: '22:00', isPreview: false, isDownloadable: false, order: 1, videoUrl: ORIENTATION_VIDEO },
          { id: 'no_l12', moduleId: 'no_mod_3', title: 'Building Your Second Brain', type: 'video', duration: '35:00', isPreview: false, isDownloadable: false, order: 2, videoUrl: ORIENTATION_VIDEO },
          { id: 'no_l13', moduleId: 'no_mod_3', title: 'Daily Notes & Journal System', type: 'video', duration: '28:30', isPreview: false, isDownloadable: false, order: 3, videoUrl: ORIENTATION_VIDEO },
          { id: 'no_l14', moduleId: 'no_mod_3', title: 'PARA Template Pack', type: 'pdf', isPreview: false, isDownloadable: true, order: 4, fileName: 'para-templates.pdf', fileSize: '1.8 MB', fileUrl: '#' },
        ],
      },
      {
        id: 'no_mod_4', courseId: 'course_2', title: 'Business OS & Automations', order: 4,
        lessons: [
          { id: 'no_l15', moduleId: 'no_mod_4', title: 'Building a Business OS in Notion', type: 'video', duration: '48:00', isPreview: false, isDownloadable: false, order: 1, videoUrl: ORIENTATION_VIDEO },
          { id: 'no_l16', moduleId: 'no_mod_4', title: 'Notion Automations & AI Features', type: 'video', duration: '32:00', isPreview: false, isDownloadable: false, order: 2, videoUrl: ORIENTATION_VIDEO },
          { id: 'no_l17', moduleId: 'no_mod_4', title: 'Team Wikis & Collaboration', type: 'video', duration: '26:15', isPreview: false, isDownloadable: false, order: 3, videoUrl: ORIENTATION_VIDEO },
          { id: 'no_l18', moduleId: 'no_mod_4', title: 'Business OS Template', type: 'pdf', isPreview: false, isDownloadable: true, order: 4, fileName: 'business-os-template.pdf', fileSize: '4.2 MB', fileUrl: '#' },
        ],
      },
    ],
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-03-10T00:00:00Z',
  },

  // ─── Course 3: Operations ─────────────────────────────────────────────────
  {
    id: 'course_3',
    title: 'Business Operations Excellence',
    slug: 'business-operations-excellence',
    description: 'Design, document and scale your business operations. SOPs, process design, and systems thinking.',
    longDescription: 'Learn how to build a world-class operations function from scratch. This course covers process mapping, SOP writing, KPI design, team management systems, quality control, and how to scale operations as your business grows. Perfect for founders, operations managers, and business analysts.',
    thumbnail: '/images/course-ops.jpg',
    instructorId: 'instructor_1',
    instructorName: 'Dr. Sarah Chen',
    category: 'Operations',
    level: 'Intermediate',
    price: 94.99,
    isFree: false,
    isFeatured: true,
    isPublished: true,
    isApproved: true,
    isComingSoon: false,
    rating: 4.7,
    reviewCount: 654,
    enrolledCount: 4180,
    duration: '30 hours',
    tags: ['Operations', 'SOPs', 'Process Design', 'Systems Thinking', 'KPIs', 'Scaling'],
    requirements: ['Basic business knowledge helpful', 'No technical skills required', 'Suitable for founders and managers'],
    whatYouLearn: [
      'Map and optimise business processes',
      'Write clear, effective SOPs',
      'Design KPI dashboards and reporting systems',
      'Build scalable team management systems',
      'Implement quality control frameworks',
      'Create an operations playbook for your business',
    ],
    orientationVideoUrl: ORIENTATION_VIDEO,
    orientationVideoTitle: 'Welcome to Business Operations Excellence — Watch First',
    modules: [
      {
        id: 'ops_mod_1', courseId: 'course_3', title: 'Operations Foundations', order: 1,
        lessons: [
          { id: 'ops_l1', moduleId: 'ops_mod_1', title: 'What is Business Operations?', type: 'video', duration: '16:30', isPreview: true, isDownloadable: false, order: 1, videoUrl: ORIENTATION_VIDEO },
          { id: 'ops_l2', moduleId: 'ops_mod_1', title: 'Systems Thinking for Business', type: 'video', duration: '24:00', isPreview: true, isDownloadable: false, order: 2, videoUrl: ORIENTATION_VIDEO },
          { id: 'ops_l3', moduleId: 'ops_mod_1', title: 'Operations Audit: Where Are You Now?', type: 'video', duration: '30:15', isPreview: false, isDownloadable: false, order: 3, videoUrl: ORIENTATION_VIDEO },
          { id: 'ops_l4', moduleId: 'ops_mod_1', title: 'Operations Audit Template', type: 'pdf', isPreview: false, isDownloadable: true, order: 4, fileName: 'ops-audit-template.pdf', fileSize: '1.4 MB', fileUrl: '#' },
          { id: 'ops_l5', moduleId: 'ops_mod_1', title: 'Foundations Quiz', type: 'quiz', isPreview: false, isDownloadable: false, order: 5, quiz: { id: 'opsq1', lessonId: 'ops_l5', questions: [{ id: 'opsqq1', question: 'What is the primary goal of business operations?', options: ['Maximise efficiency and value delivery', 'Increase headcount', 'Reduce marketing spend', 'Expand office space'], correctIndex: 0 }, { id: 'opsqq2', question: 'What does SOP stand for?', options: ['Standard Operating Procedure', 'System of Processes', 'Strategic Operations Plan', 'Staff Onboarding Protocol'], correctIndex: 0 }] } },
        ],
      },
      {
        id: 'ops_mod_2', courseId: 'course_3', title: 'Process Design & SOPs', order: 2,
        lessons: [
          { id: 'ops_l6', moduleId: 'ops_mod_2', title: 'Process Mapping with Flowcharts', type: 'video', duration: '35:00', isPreview: false, isDownloadable: false, order: 1, videoUrl: ORIENTATION_VIDEO },
          { id: 'ops_l7', moduleId: 'ops_mod_2', title: 'Writing Effective SOPs', type: 'video', duration: '40:20', isPreview: false, isDownloadable: false, order: 2, videoUrl: ORIENTATION_VIDEO },
          { id: 'ops_l8', moduleId: 'ops_mod_2', title: 'SOP Review & Approval Workflows', type: 'video', duration: '22:45', isPreview: false, isDownloadable: false, order: 3, videoUrl: ORIENTATION_VIDEO },
          { id: 'ops_l9', moduleId: 'ops_mod_2', title: 'SOP Template Pack', type: 'pdf', isPreview: false, isDownloadable: true, order: 4, fileName: 'sop-templates.pdf', fileSize: '2.7 MB', fileUrl: '#' },
          { id: 'ops_l10', moduleId: 'ops_mod_2', title: 'Write an SOP for Your Business (Assignment)', type: 'assignment', isPreview: false, isDownloadable: false, order: 5 },
        ],
      },
      {
        id: 'ops_mod_3', courseId: 'course_3', title: 'KPIs & Performance Management', order: 3,
        lessons: [
          { id: 'ops_l11', moduleId: 'ops_mod_3', title: 'Choosing the Right KPIs', type: 'video', duration: '28:00', isPreview: false, isDownloadable: false, order: 1, videoUrl: ORIENTATION_VIDEO },
          { id: 'ops_l12', moduleId: 'ops_mod_3', title: 'Building a KPI Dashboard', type: 'video', duration: '38:30', isPreview: false, isDownloadable: false, order: 2, videoUrl: ORIENTATION_VIDEO },
          { id: 'ops_l13', moduleId: 'ops_mod_3', title: 'Weekly & Monthly Reporting Cadence', type: 'video', duration: '25:00', isPreview: false, isDownloadable: false, order: 3, videoUrl: ORIENTATION_VIDEO },
          { id: 'ops_l14', moduleId: 'ops_mod_3', title: 'KPI Dashboard Template', type: 'pdf', isPreview: false, isDownloadable: true, order: 4, fileName: 'kpi-dashboard.pdf', fileSize: '1.9 MB', fileUrl: '#' },
        ],
      },
      {
        id: 'ops_mod_4', courseId: 'course_3', title: 'Scaling Operations', order: 4,
        lessons: [
          { id: 'ops_l15', moduleId: 'ops_mod_4', title: 'Building an Operations Playbook', type: 'video', duration: '44:00', isPreview: false, isDownloadable: false, order: 1, videoUrl: ORIENTATION_VIDEO },
          { id: 'ops_l16', moduleId: 'ops_mod_4', title: 'Hiring & Onboarding for Scale', type: 'video', duration: '32:15', isPreview: false, isDownloadable: false, order: 2, videoUrl: ORIENTATION_VIDEO },
          { id: 'ops_l17', moduleId: 'ops_mod_4', title: 'Quality Control & Continuous Improvement', type: 'video', duration: '28:00', isPreview: false, isDownloadable: false, order: 3, videoUrl: ORIENTATION_VIDEO },
          { id: 'ops_l18', moduleId: 'ops_mod_4', title: 'Operations Playbook Template', type: 'pdf', isPreview: false, isDownloadable: true, order: 4, fileName: 'ops-playbook.pdf', fileSize: '3.5 MB', fileUrl: '#' },
        ],
      },
    ],
    createdAt: '2024-02-15T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z',
  },
];

export const mockEnrollments: Enrollment[] = [
  {
    id: 'enroll_1', studentId: 'student_1', courseId: 'course_1',
    enrolledAt: '2024-02-15T00:00:00Z', progress: 45,
    completedLessons: ['pm_l1', 'pm_l2', 'pm_l3', 'pm_l4', 'pm_l5'],
    lastAccessedLesson: 'pm_l6', quizScores: { pmq1: 90 }, isCompleted: false,
  },
  {
    id: 'enroll_2', studentId: 'student_1', courseId: 'course_2',
    enrolledAt: '2024-02-20T00:00:00Z', progress: 20,
    completedLessons: ['no_l1', 'no_l2'],
    lastAccessedLesson: 'no_l2', quizScores: {}, isCompleted: false,
  },
  {
    id: 'enroll_3', studentId: 'student_2', courseId: 'course_1',
    enrolledAt: '2024-02-18T00:00:00Z', progress: 70,
    completedLessons: ['pm_l1', 'pm_l2', 'pm_l3', 'pm_l4', 'pm_l5', 'pm_l6', 'pm_l7', 'pm_l8', 'pm_l9', 'pm_l10', 'pm_l11', 'pm_l12'],
    quizScores: { pmq1: 100 }, isCompleted: false,
  },
  {
    id: 'enroll_4', studentId: 'student_3', courseId: 'course_2',
    enrolledAt: '2024-03-05T00:00:00Z', progress: 55,
    completedLessons: ['no_l1', 'no_l2', 'no_l3', 'no_l4', 'no_l5', 'no_l6', 'no_l7', 'no_l8'],
    quizScores: { noq1: 85 }, isCompleted: false,
  },
  {
    id: 'enroll_5', studentId: 'student_3', courseId: 'course_3',
    enrolledAt: '2024-03-10T00:00:00Z', progress: 30,
    completedLessons: ['ops_l1', 'ops_l2', 'ops_l3', 'ops_l4', 'ops_l5'],
    quizScores: { opsq1: 80 }, isCompleted: false,
  },
];

export const mockCourseRequests: CourseRequest[] = [
  {
    id: 'req_1', instructorId: 'instructor_2', instructorName: 'Marcus Johnson',
    courseTitle: 'Advanced Notion for Teams & Enterprises',
    courseDescription: 'Deep dive into Notion for large teams — permissions, advanced automations, API integrations, and enterprise rollouts.',
    category: 'Productivity', status: 'pending', submittedAt: '2024-03-15T00:00:00Z',
  },
  {
    id: 'req_2', instructorId: 'instructor_1', instructorName: 'Dr. Sarah Chen',
    courseTitle: 'PMP Exam Prep Bootcamp',
    courseDescription: 'Intensive PMP certification prep with 500+ practice questions, mock exams, and exam strategy.',
    category: 'Project Management', status: 'approved', submittedAt: '2024-03-10T00:00:00Z',
    reviewedAt: '2024-03-12T00:00:00Z', adminNote: 'Excellent proposal. Approved.',
  },
];

export const mockReviews: Review[] = [
  {
    id: 'review_1', courseId: 'course_1', studentId: 'student_2', studentName: 'Emma Wilson',
    rating: 5, comment: 'This is hands down the best project management course I have taken. Dr. Sarah breaks down complex concepts so clearly. I passed my PMP exam on the first attempt!',
    createdAt: '2024-03-10T00:00:00Z',
  },
  {
    id: 'review_2', courseId: 'course_1', studentId: 'student_3', studentName: 'Carlos Rivera',
    rating: 5, comment: 'The Agile and Scrum modules alone are worth the price. My team now runs sprints like clockwork. Highly recommended for anyone stepping into a PM role.',
    createdAt: '2024-03-15T00:00:00Z',
  },
  {
    id: 'review_3', courseId: 'course_2', studentId: 'student_3', studentName: 'Carlos Rivera',
    rating: 5, comment: 'Marcus is an incredible teacher. I went from barely knowing Notion to building our entire company OS in it. The relations & rollups module is pure gold.',
    createdAt: '2024-03-20T00:00:00Z',
  },
  {
    id: 'review_4', courseId: 'course_2', studentId: 'student_2', studentName: 'Emma Wilson',
    rating: 4, comment: 'Really practical course. The PARA method section completely changed how I organise my work. Would love even more templates included.',
    createdAt: '2024-03-22T00:00:00Z',
  },
  {
    id: 'review_5', courseId: 'course_3', studentId: 'student_1', studentName: 'Jordan Lee',
    rating: 5, comment: 'The SOP writing module is exceptional. I used the templates to document our entire customer support process and it saved us hours every week.',
    createdAt: '2024-03-25T00:00:00Z',
  },
];

export const mockLiveClasses: LiveClass[] = [];
