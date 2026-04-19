import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/admin/stats
router.get('/stats', authenticate, requireAdmin, async (_req: AuthRequest, res: Response) => {
  try {
    const [students, instructors, courses, enrollments, payments, completions] = await Promise.all([
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.user.count({ where: { role: 'INSTRUCTOR' } }),
      prisma.course.count({ where: { isApproved: true } }),
      prisma.enrollment.count(),
      prisma.payment.aggregate({ _sum: { amountKobo: true }, _count: { id: true } }),
      prisma.enrollment.count({ where: { isCompleted: true } }),
    ]);
    res.json({
      students, instructors, courses, enrollments,
      totalRevenueKobo: payments._sum.amountKobo || 0,
      totalTransactions: payments._count.id,
      completionRate: enrollments > 0 ? Math.round((completions / enrollments) * 100) : 0,
    });
  } catch {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// GET /api/admin/payments
router.get('/payments', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const payments = await prisma.payment.findMany({
      include: { student: { select: { name: true, email: true } }, course: { select: { title: true } } },
      orderBy: { paidAt: 'desc' },
    });
    res.json({ payments });
  } catch {
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// GET /api/admin/course-requests
router.get('/course-requests', authenticate, requireAdmin, async (_req: AuthRequest, res: Response) => {
  try {
    const requests = await prisma.courseRequest.findMany({
      include: { instructor: { select: { name: true, email: true } } },
      orderBy: { submittedAt: 'desc' },
    });
    res.json({ requests });
  } catch {
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

// PATCH /api/admin/course-requests/:id
router.patch('/course-requests/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { status, adminNote } = req.body;
    const updated = await prisma.courseRequest.update({
      where: { id: req.params.id },
      data: { status: status.toUpperCase(), adminNote, reviewedAt: new Date() },
    });
    res.json({ request: updated });
  } catch {
    res.status(500).json({ error: 'Failed to update request' });
  }
});

export default router;
