import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { verifyPaystackTransaction } from '../lib/paystack';
import { sendEnrollmentEmail, sendCertificateEmail } from '../lib/email';

const router = Router();

// POST /api/enrollments/verify-payment — verify Paystack & enroll
router.post('/verify-payment', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { reference, courseId } = req.body;
    if (!reference || !courseId) { res.status(400).json({ error: 'Reference and courseId required' }); return; }

    // Check not already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId: req.user!.userId, courseId } },
    });
    if (existingEnrollment) { res.status(409).json({ error: 'Already enrolled' }); return; }

    // Verify with Paystack
    const verification = await verifyPaystackTransaction(reference);
    if (!verification.status || verification.data?.status !== 'success') {
      res.status(400).json({ error: 'Payment verification failed' }); return;
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) { res.status(404).json({ error: 'Course not found' }); return; }

    const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
    if (!user) { res.status(404).json({ error: 'User not found' }); return; }

    const amountKobo = verification.data.amount;
    const amountNgn = amountKobo / 100;

    // Record payment & create enrollment in a transaction
    const [payment, enrollment] = await prisma.$transaction([
      prisma.payment.create({
        data: {
          studentId: req.user!.userId,
          courseId,
          amountKobo,
          amountNgn,
          amountUsd: Number(course.price),
          reference,
          status: 'success',
        },
      }),
      prisma.enrollment.create({
        data: {
          studentId: req.user!.userId,
          courseId,
          paymentRef: reference,
          amountPaid: amountKobo,
        },
      }),
      prisma.course.update({
        where: { id: courseId },
        data: { enrolledCount: { increment: 1 } },
      }),
    ] as any);

    // Send email (non-blocking)
    sendEnrollmentEmail(user.email, user.name, course.title, reference).catch(console.error);

    res.status(201).json({ enrollment, payment });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Enrollment failed' });
  }
});

// POST /api/enrollments/free — enroll in free course
router.post('/free', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { courseId } = req.body;
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) { res.status(404).json({ error: 'Course not found' }); return; }
    if (!course.isFree && Number(course.price) > 0) { res.status(400).json({ error: 'This is a paid course' }); return; }
    const existing = await prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId: req.user!.userId, courseId } },
    });
    if (existing) { res.status(409).json({ error: 'Already enrolled' }); return; }
    const enrollment = await prisma.enrollment.create({ data: { studentId: req.user!.userId, courseId } });
    await prisma.course.update({ where: { id: courseId }, data: { enrolledCount: { increment: 1 } } });
    res.status(201).json({ enrollment });
  } catch {
    res.status(500).json({ error: 'Enrollment failed' });
  }
});

// GET /api/enrollments/my — student's enrollments
router.get('/my', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: req.user!.userId },
      include: { course: { include: { instructor: { select: { name: true } } } }, lessonProgress: true },
      orderBy: { enrolledAt: 'desc' },
    });
    res.json({ enrollments });
  } catch {
    res.status(500).json({ error: 'Failed to fetch enrollments' });
  }
});

// POST /api/enrollments/:id/progress — mark lesson complete
router.post('/:id/progress', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { lessonId } = req.body;
    const enrollment = await prisma.enrollment.findFirst({
      where: { id: req.params.id, studentId: req.user!.userId },
      include: { course: { include: { modules: { include: { lessons: true } } } }, lessonProgress: true },
    });
    if (!enrollment) { res.status(404).json({ error: 'Enrollment not found' }); return; }

    // Add lesson progress (ignore duplicate)
    await prisma.lessonProgress.upsert({
      where: { enrollmentId_lessonId: { enrollmentId: enrollment.id, lessonId } },
      create: { enrollmentId: enrollment.id, lessonId },
      update: {},
    });

    // Recalculate progress
    const totalLessons = enrollment.course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
    const completed = enrollment.lessonProgress.length + 1;
    const progress = Math.min(100, Math.round((completed / totalLessons) * 100));
    const isCompleted = progress === 100;

    const updated = await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: { progress, isCompleted, completedAt: isCompleted ? new Date() : undefined, lastAccessedLessonId: lessonId },
    });

    // Issue certificate if completed
    if (isCompleted) {
      const certNum = `NFA-${Date.now().toString(36).toUpperCase()}`;
      await prisma.certificate.upsert({
        where: { studentId_courseId: { studentId: req.user!.userId, courseId: enrollment.courseId } },
        create: { studentId: req.user!.userId, courseId: enrollment.courseId, certificateNumber: certNum },
        update: {},
      });
      const [user, course] = await Promise.all([
        prisma.user.findUnique({ where: { id: req.user!.userId } }),
        prisma.course.findUnique({ where: { id: enrollment.courseId } }),
      ]);
      if (user && course) sendCertificateEmail(user.email, user.name, course.title, certNum).catch(console.error);
    }

    res.json({ enrollment: updated, progress, isCompleted });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update progress' });
  }
});

export default router;
