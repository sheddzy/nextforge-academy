import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticate, requireInstructor, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/instructor/dashboard
router.get('/dashboard', authenticate, requireInstructor, async (req: AuthRequest, res: Response) => {
  try {
    const courses = await prisma.course.findMany({
      where: { instructorId: req.user!.userId },
      include: { enrollments: true, reviews: true },
    });
    const totalStudents = courses.reduce((a, c) => a + c.enrollments.length, 0);
    const avgRating = courses.length > 0
      ? courses.reduce((a, c) => a + c.rating, 0) / courses.length
      : 0;
    res.json({ courses, totalStudents, avgRating: Math.round(avgRating * 10) / 10 });
  } catch {
    res.status(500).json({ error: 'Failed to fetch dashboard' });
  }
});

// GET /api/instructor/students
router.get('/students', authenticate, requireInstructor, async (req: AuthRequest, res: Response) => {
  try {
    const courses = await prisma.course.findMany({ where: { instructorId: req.user!.userId }, select: { id: true } });
    const courseIds = courses.map(c => c.id);
    const enrollments = await prisma.enrollment.findMany({
      where: { courseId: { in: courseIds } },
      include: { student: { select: { id: true, name: true, email: true, avatarUrl: true } }, course: { select: { title: true } } },
      orderBy: { enrolledAt: 'desc' },
    });
    res.json({ enrollments });
  } catch {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// POST /api/instructor/course-request
router.post('/course-request', authenticate, requireInstructor, async (req: AuthRequest, res: Response) => {
  try {
    const { courseTitle, courseDescription, category } = req.body;
    // Check no pending request
    const pending = await prisma.courseRequest.findFirst({
      where: { instructorId: req.user!.userId, status: 'PENDING' },
    });
    if (pending) { res.status(400).json({ error: 'You already have a pending request' }); return; }
    const request = await prisma.courseRequest.create({
      data: { instructorId: req.user!.userId, courseTitle, courseDescription, category },
    });
    res.status(201).json({ request });
  } catch {
    res.status(500).json({ error: 'Failed to submit request' });
  }
});

// GET /api/instructor/course-requests
router.get('/course-requests', authenticate, requireInstructor, async (req: AuthRequest, res: Response) => {
  try {
    const requests = await prisma.courseRequest.findMany({
      where: { instructorId: req.user!.userId },
      orderBy: { submittedAt: 'desc' },
    });
    res.json({ requests });
  } catch {
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

// POST /api/instructor/announcements
router.post('/announcements', authenticate, requireInstructor, async (req: AuthRequest, res: Response) => {
  try {
    const { courseId, title, content } = req.body;
    const course = await prisma.course.findFirst({ where: { id: courseId, instructorId: req.user!.userId } });
    if (!course) { res.status(403).json({ error: 'Not your course' }); return; }
    const announcement = await prisma.announcement.create({
      data: { courseId, instructorId: req.user!.userId, title, content },
    });
    res.status(201).json({ announcement });
  } catch {
    res.status(500).json({ error: 'Failed to create announcement' });
  }
});

// GET /api/instructor/announcements/:courseId
router.get('/announcements/:courseId', authenticate, requireInstructor, async (req: AuthRequest, res: Response) => {
  try {
    const announcements = await prisma.announcement.findMany({
      where: { courseId: req.params.courseId, instructorId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ announcements });
  } catch {
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
});

export default router;
