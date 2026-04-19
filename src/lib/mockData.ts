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
    bio: 'Full-Stack Engineer · 10+ years · ex-Google',
    enrolledCourses: [], completedCourses: [], certificates: [],
  },
  {
    id: 'instructor_2',
    name: 'Marcus Johnson',
    email: 'marcus@nextforgeacademy.online',
    role: 'instructor',
    isVerified: true, isApproved: true, isSuspended: false,
    createdAt: '2024-02-01T00:00:00Z',
    bio: 'Data Science & ML · PhD MIT',
    enrolledCourses: [], completedCourses: [], certificates: [],
  },
  {
    id: 'instructor_3',
    name: 'Priya Patel',
    email: 'priya@nextforgeacademy.online',
    role: 'instructor',
    isVerified: true, isApproved: false, isSuspended: false,
    createdAt: '2024-03-01T00:00:00Z',
    bio: 'Cloud & DevOps · AWS Solutions Architect',
    enrolledCourses: [], completedCourses: [], certificates: [],
  },
  {
    id: 'student_1',
    name: 'Jordan Lee',
    email: 'student@nextforgeacademy.online',
    role: 'student',
    isVerified: true, isApproved: true, isSuspended: false,
    createdAt: '2024-02-10T00:00:00Z',
    bio: 'Aspiring full-stack developer',
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
    enrolledCourses: ['course_1'],
    completedCourses: [], certificates: [],
  },
  {
    id: 'student_3',
    name: 'Carlos Rivera',
    email: 'carlos@example.com',
    role: 'student',
    isVerified: true, isApproved: true, isSuspended: false,
    createdAt: '2024-03-05T00:00:00Z',
    enrolledCourses: ['course_2'],
    completedCourses: [], certificates: [],
  },
];

export const mockCourses: Course[] = [
  /* ── COURSE 1: Active ── */
  {
    id: 'course_1',
    title: 'Complete Full-Stack Web Development',
    slug: 'full-stack-web-development',
    description: 'Master React, Node.js, PostgreSQL and ship production apps from scratch.',
    longDescription: 'Go from zero to production-ready full-stack developer. You will build real-world apps using React 18, TypeScript, Node.js, Express, PostgreSQL with Prisma ORM, and deploy to cloud platforms.',
    thumbnail: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&q=80',
    instructorId: 'instructor_1',
    instructorName: 'Dr. Sarah Chen',
    category: 'Web Development',
    level: 'Beginner',
    price: 89.99, isFree: false, isFeatured: true,
    isPublished: true, isApproved: true, isComingSoon: false,
    rating: 4.8, reviewCount: 2847, enrolledCount: 12450,
    duration: '42 hours',
    tags: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
    requirements: ['Basic HTML/CSS', 'Computer with internet'],
    whatYouLearn: ['Build full-stack apps with React & Node.js', 'Design PostgreSQL databases', 'JWT authentication', 'Deploy to production', 'TypeScript best practices'],
    modules: [
      {
        id: 'mod_1_1', courseId: 'course_1', title: 'Getting Started', order: 1,
        lessons: [
          { id: 'l1', moduleId: 'mod_1_1', title: 'Course Introduction', type: 'video', duration: '12:30', isPreview: true, isDownloadable: false, order: 1, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { id: 'l2', moduleId: 'mod_1_1', title: 'How the Web Works', type: 'video', duration: '18:45', isPreview: true, isDownloadable: false, order: 2, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { id: 'l3', moduleId: 'mod_1_1', title: 'Dev Environment Setup', type: 'video', duration: '25:10', isPreview: false, isDownloadable: false, order: 3, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { id: 'l4', moduleId: 'mod_1_1', title: 'Module 1 Slides', type: 'slide', isPreview: false, isDownloadable: true, order: 4, fileName: 'module-1-slides.pdf', fileSize: '2.4 MB', fileUrl: '#' },
          { id: 'l5', moduleId: 'mod_1_1', title: 'Module 1 Resources', type: 'pdf', isPreview: false, isDownloadable: true, order: 5, fileName: 'module-1-resources.pdf', fileSize: '1.1 MB', fileUrl: '#' },
          { id: 'l6', moduleId: 'mod_1_1', title: 'Module 1 Quiz', type: 'quiz', isPreview: false, isDownloadable: false, order: 6, quiz: { id: 'q1', lessonId: 'l6', questions: [{ id: 'qq1', question: 'What does HTML stand for?', options: ['HyperText Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyper Transfer Markup Language'], correctIndex: 0 }, { id: 'qq2', question: 'Which protocol does the web use?', options: ['FTP', 'HTTP/HTTPS', 'SMTP', 'SSH'], correctIndex: 1 }] } },
        ],
      },
      {
        id: 'mod_1_2', courseId: 'course_1', title: 'React Fundamentals', order: 2,
        lessons: [
          { id: 'l7', moduleId: 'mod_1_2', title: 'Introduction to React', type: 'video', duration: '20:00', isPreview: false, isDownloadable: false, order: 1, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { id: 'l8', moduleId: 'mod_1_2', title: 'Components & Props', type: 'video', duration: '35:15', isPreview: false, isDownloadable: false, order: 2, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { id: 'l9', moduleId: 'mod_1_2', title: 'State & Hooks', type: 'video', duration: '42:00', isPreview: false, isDownloadable: false, order: 3, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { id: 'l10', moduleId: 'mod_1_2', title: 'React Cheatsheet', type: 'pdf', isPreview: false, isDownloadable: true, order: 4, fileName: 'react-cheatsheet.pdf', fileSize: '890 KB', fileUrl: '#' },
        ],
      },
      {
        id: 'mod_1_3', courseId: 'course_1', title: 'Node.js & Express', order: 3,
        lessons: [
          { id: 'l11', moduleId: 'mod_1_3', title: 'Node.js Fundamentals', type: 'video', duration: '28:30', isPreview: false, isDownloadable: false, order: 1, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { id: 'l12', moduleId: 'mod_1_3', title: 'Building REST APIs', type: 'video', duration: '45:00', isPreview: false, isDownloadable: false, order: 2, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { id: 'l13', moduleId: 'mod_1_3', title: 'JWT Authentication', type: 'video', duration: '38:20', isPreview: false, isDownloadable: false, order: 3, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { id: 'l14', moduleId: 'mod_1_3', title: 'API Design Guide', type: 'pdf', isPreview: false, isDownloadable: true, order: 4, fileName: 'api-design-guide.pdf', fileSize: '1.8 MB', fileUrl: '#' },
        ],
      },
    ],
    createdAt: '2024-01-20T00:00:00Z', updatedAt: '2024-03-01T00:00:00Z',
  },

  /* ── COURSE 2: Active ── */
  {
    id: 'course_2',
    title: 'Data Science & Machine Learning with Python',
    slug: 'data-science-machine-learning',
    description: 'From pandas to neural networks — master data science with real-world projects.',
    longDescription: 'Dive deep into data science and machine learning with Python. Covers pandas, NumPy, scikit-learn, TensorFlow, and production ML deployment.',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    instructorId: 'instructor_2',
    instructorName: 'Marcus Johnson',
    category: 'Data Science',
    level: 'Intermediate',
    price: 94.99, isFree: false, isFeatured: true,
    isPublished: true, isApproved: true, isComingSoon: false,
    rating: 4.9, reviewCount: 1923, enrolledCount: 8730,
    duration: '58 hours',
    tags: ['Python', 'Machine Learning', 'TensorFlow', 'AI'],
    requirements: ['Basic Python', 'High school maths'],
    whatYouLearn: ['Data manipulation with pandas', 'ML models with scikit-learn', 'Neural networks with TensorFlow', 'Data visualisation', 'Deploy ML models'],
    modules: [
      {
        id: 'mod_2_1', courseId: 'course_2', title: 'Python for Data Science', order: 1,
        lessons: [
          { id: 'l20', moduleId: 'mod_2_1', title: 'Python Refresher', type: 'video', duration: '30:00', isPreview: true, isDownloadable: false, order: 1, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { id: 'l21', moduleId: 'mod_2_1', title: 'NumPy Deep Dive', type: 'video', duration: '45:00', isPreview: false, isDownloadable: false, order: 2, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { id: 'l22', moduleId: 'mod_2_1', title: 'Pandas Mastery', type: 'video', duration: '52:00', isPreview: false, isDownloadable: false, order: 3, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { id: 'l23', moduleId: 'mod_2_1', title: 'Python DS Slides', type: 'slide', isPreview: false, isDownloadable: true, order: 4, fileName: 'python-ds-slides.pdf', fileSize: '3.1 MB', fileUrl: '#' },
          { id: 'l24', moduleId: 'mod_2_1', title: 'Data Wrangling Quiz', type: 'quiz', isPreview: false, isDownloadable: false, order: 5, quiz: { id: 'q2', lessonId: 'l24', questions: [{ id: 'qq3', question: 'Which library is used for data manipulation?', options: ['NumPy', 'pandas', 'matplotlib', 'scikit-learn'], correctIndex: 1 }] } },
        ],
      },
      {
        id: 'mod_2_2', courseId: 'course_2', title: 'Machine Learning', order: 2,
        lessons: [
          { id: 'l25', moduleId: 'mod_2_2', title: 'Supervised vs Unsupervised', type: 'video', duration: '25:00', isPreview: false, isDownloadable: false, order: 1, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { id: 'l26', moduleId: 'mod_2_2', title: 'Linear Regression', type: 'video', duration: '40:00', isPreview: false, isDownloadable: false, order: 2, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { id: 'l27', moduleId: 'mod_2_2', title: 'Classification Algorithms', type: 'video', duration: '48:00', isPreview: false, isDownloadable: false, order: 3, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { id: 'l28', moduleId: 'mod_2_2', title: 'ML Reference Sheet', type: 'pdf', isPreview: false, isDownloadable: true, order: 4, fileName: 'ml-reference.pdf', fileSize: '2.0 MB', fileUrl: '#' },
        ],
      },
    ],
    createdAt: '2024-02-01T00:00:00Z', updatedAt: '2024-03-10T00:00:00Z',
  },

  /* ── COURSE 3: Active ── */
  {
    id: 'course_3',
    title: 'Cloud Architecture & DevOps Engineering',
    slug: 'cloud-architecture-devops',
    description: 'Master AWS, Docker, Kubernetes, CI/CD pipelines and infrastructure as code.',
    longDescription: 'Become a cloud and DevOps expert. Covers AWS in depth, Docker, Kubernetes, CI/CD pipelines, Terraform and Ansible.',
    thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&q=80',
    instructorId: 'instructor_1',
    instructorName: 'Dr. Sarah Chen',
    category: 'DevOps',
    level: 'Advanced',
    price: 109.99, isFree: false, isFeatured: true,
    isPublished: true, isApproved: true, isComingSoon: false,
    rating: 4.7, reviewCount: 1456, enrolledCount: 6210,
    duration: '65 hours',
    tags: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
    requirements: ['Linux basics', 'Networking fundamentals'],
    whatYouLearn: ['AWS infrastructure', 'Docker containerisation', 'Kubernetes orchestration', 'CI/CD with GitHub Actions', 'Terraform IaC'],
    modules: [
      {
        id: 'mod_3_1', courseId: 'course_3', title: 'AWS Fundamentals', order: 1,
        lessons: [
          { id: 'l30', moduleId: 'mod_3_1', title: 'AWS Global Infrastructure', type: 'video', duration: '22:00', isPreview: true, isDownloadable: false, order: 1, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { id: 'l31', moduleId: 'mod_3_1', title: 'EC2, S3 & VPC', type: 'video', duration: '55:00', isPreview: false, isDownloadable: false, order: 2, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { id: 'l32', moduleId: 'mod_3_1', title: 'AWS Architecture Slides', type: 'slide', isPreview: false, isDownloadable: true, order: 3, fileName: 'aws-architecture.pdf', fileSize: '4.2 MB', fileUrl: '#' },
        ],
      },
      {
        id: 'mod_3_2', courseId: 'course_3', title: 'Docker & Containers', order: 2,
        lessons: [
          { id: 'l33', moduleId: 'mod_3_2', title: 'Docker Fundamentals', type: 'video', duration: '35:00', isPreview: false, isDownloadable: false, order: 1, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { id: 'l34', moduleId: 'mod_3_2', title: 'Docker Compose & Networking', type: 'video', duration: '42:00', isPreview: false, isDownloadable: false, order: 2, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { id: 'l35', moduleId: 'mod_3_2', title: 'Docker Cheatsheet', type: 'pdf', isPreview: false, isDownloadable: true, order: 3, fileName: 'docker-cheatsheet.pdf', fileSize: '750 KB', fileUrl: '#' },
        ],
      },
    ],
    createdAt: '2024-02-15T00:00:00Z', updatedAt: '2024-03-15T00:00:00Z',
  },

  /* ── COURSE 4: Coming Soon ── */
  {
    id: 'course_4',
    title: 'UI/UX Design Masterclass',
    slug: 'ui-ux-design-masterclass',
    description: 'Design stunning digital products with Figma. From wireframes to production.',
    longDescription: 'Coming soon.',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
    instructorId: 'instructor_2',
    instructorName: 'Marcus Johnson',
    category: 'Design',
    level: 'Beginner',
    price: 74.99, isFree: false, isFeatured: false,
    isPublished: false, isApproved: false, isComingSoon: true,
    rating: 0, reviewCount: 0, enrolledCount: 0,
    duration: '38 hours',
    tags: ['Figma', 'UI Design', 'UX Research'],
    requirements: [], whatYouLearn: [], modules: [],
    createdAt: '2024-03-01T00:00:00Z', updatedAt: '2024-03-01T00:00:00Z',
  },

  /* ── COURSE 5: Coming Soon ── */
  {
    id: 'course_5',
    title: 'Cybersecurity & Ethical Hacking',
    slug: 'cybersecurity-ethical-hacking',
    description: 'Think like a hacker to defend systems. CEH exam prep included.',
    longDescription: 'Coming soon.',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
    instructorId: 'instructor_2',
    instructorName: 'Marcus Johnson',
    category: 'Cybersecurity',
    level: 'Intermediate',
    price: 99.99, isFree: false, isFeatured: false,
    isPublished: false, isApproved: false, isComingSoon: true,
    rating: 0, reviewCount: 0, enrolledCount: 0,
    duration: '50 hours',
    tags: ['Security', 'Ethical Hacking', 'CEH'],
    requirements: [], whatYouLearn: [], modules: [],
    createdAt: '2024-03-10T00:00:00Z', updatedAt: '2024-03-10T00:00:00Z',
  },

  /* ── COURSE 6: Coming Soon ── */
  {
    id: 'course_6',
    title: 'Mobile App Development with React Native',
    slug: 'react-native-mobile-dev',
    description: 'Build cross-platform iOS & Android apps with React Native and Expo.',
    longDescription: 'Coming soon.',
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
    instructorId: 'instructor_1',
    instructorName: 'Dr. Sarah Chen',
    category: 'Mobile Development',
    level: 'Intermediate',
    price: 84.99, isFree: false, isFeatured: false,
    isPublished: false, isApproved: false, isComingSoon: true,
    rating: 0, reviewCount: 0, enrolledCount: 0,
    duration: '45 hours',
    tags: ['React Native', 'Expo', 'iOS', 'Android'],
    requirements: [], whatYouLearn: [], modules: [],
    createdAt: '2024-03-20T00:00:00Z', updatedAt: '2024-03-20T00:00:00Z',
  },
];

export const mockEnrollments: Enrollment[] = [
  { id: 'enroll_1', studentId: 'student_1', courseId: 'course_1', enrolledAt: '2024-02-15T00:00:00Z', progress: 45, completedLessons: ['l1','l2','l3','l4','l5','l6'], lastAccessedLesson: 'l7', quizScores: { q1: 90 }, isCompleted: false },
  { id: 'enroll_2', studentId: 'student_1', courseId: 'course_2', enrolledAt: '2024-02-20T00:00:00Z', progress: 20, completedLessons: ['l20','l21'], lastAccessedLesson: 'l21', quizScores: {}, isCompleted: false },
  { id: 'enroll_3', studentId: 'student_2', courseId: 'course_1', enrolledAt: '2024-02-18T00:00:00Z', progress: 78, completedLessons: ['l1','l2','l3','l4','l5','l6','l7','l8','l9'], quizScores: { q1: 100 }, isCompleted: false },
  { id: 'enroll_4', studentId: 'student_3', courseId: 'course_2', enrolledAt: '2024-03-05T00:00:00Z', progress: 60, completedLessons: ['l20','l21','l22'], quizScores: {}, isCompleted: false },
];

export const mockCourseRequests: CourseRequest[] = [
  { id: 'req_1', instructorId: 'instructor_2', instructorName: 'Marcus Johnson', courseTitle: 'Advanced Deep Learning & NLP', courseDescription: 'Transformer architectures, BERT, GPT models and production ML.', category: 'Data Science', status: 'pending', submittedAt: '2024-03-15T00:00:00Z' },
  { id: 'req_2', instructorId: 'instructor_1', instructorName: 'Dr. Sarah Chen', courseTitle: 'Microservices with Go', courseDescription: 'Build scalable microservices using Go, gRPC and event-driven architecture.', category: 'Backend Development', status: 'approved', submittedAt: '2024-03-10T00:00:00Z', reviewedAt: '2024-03-12T00:00:00Z', adminNote: 'Approved for development.' },
];

export const mockReviews: Review[] = [
  { id: 'review_1', courseId: 'course_1', studentId: 'student_2', studentName: 'Emma Wilson', rating: 5, comment: 'Absolutely the best full-stack course I have taken. Dr. Sarah explains everything clearly and the projects are real-world.', createdAt: '2024-03-10T00:00:00Z' },
  { id: 'review_2', courseId: 'course_1', studentId: 'student_3', studentName: 'Carlos Rivera', rating: 5, comment: 'Outstanding course! The Node.js and PostgreSQL sections were particularly strong.', createdAt: '2024-03-15T00:00:00Z' },
  { id: 'review_3', courseId: 'course_2', studentId: 'student_3', studentName: 'Carlos Rivera', rating: 5, comment: 'Marcus is an incredible teacher. The ML fundamentals section changed how I think about data.', createdAt: '2024-03-20T00:00:00Z' },
];

// Generate a Jitsi room name (safe alphanumeric)
function jitsiRoom(name: string) {
  return 'NextForge-' + name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
}

const now = new Date();
const inOneHour = new Date(now.getTime() + 60 * 60 * 1000).toISOString();
const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
const tomorrow = new Date(now.getTime() + 25 * 60 * 60 * 1000).toISOString();

export const mockLiveClasses: LiveClass[] = [
  {
    id: 'live_1',
    courseId: 'course_1',
    instructorId: 'instructor_1',
    instructorName: 'Dr. Sarah Chen',
    title: 'React Hooks Deep Dive — Live Q&A',
    description: 'Live walkthrough of useEffect, useContext and custom hooks with live coding.',
    scheduledAt: inOneHour,
    duration: 90,
    status: 'scheduled',
    roomName: jitsiRoom('ReactHooksDeepDive'),
    meetingUrl: 'https://meet.jit.si/NextForge-ReactHooksDeepDive',
    createdAt: now.toISOString(),
  },
  {
    id: 'live_2',
    courseId: 'course_2',
    instructorId: 'instructor_2',
    instructorName: 'Marcus Johnson',
    title: 'Pandas & Data Cleaning Workshop',
    description: 'Hands-on session cleaning messy real-world datasets with pandas.',
    scheduledAt: tomorrow,
    duration: 120,
    status: 'scheduled',
    roomName: jitsiRoom('PandasDataCleaning'),
    meetingUrl: 'https://meet.jit.si/NextForge-PandasDataCleaning',
    createdAt: now.toISOString(),
  },
  {
    id: 'live_3',
    courseId: 'course_1',
    instructorId: 'instructor_1',
    instructorName: 'Dr. Sarah Chen',
    title: 'Node.js REST API Masterclass',
    description: 'Building a complete REST API with authentication from scratch.',
    scheduledAt: yesterday,
    duration: 90,
    status: 'ended',
    roomName: jitsiRoom('NodeRESTMasterclass'),
    meetingUrl: 'https://meet.jit.si/NextForge-NodeRESTMasterclass',
    recordingUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    createdAt: yesterday,
  },
];
