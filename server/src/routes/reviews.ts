import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/reviews/course/:courseId
router.get('/course/:courseId', async (req: AuthRequest, res: Response) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { courseId: req.params.courseId },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ reviews });
  } catch {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// POST /api/reviews — submit review
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { courseId, rating, comment } = req.body;
    if (!courseId || !rating || !comment) { res.status(400).json({ error: 'courseId, rating and comment required' }); return; }
    if (rating < 1 || rating > 5) { res.status(400).json({ error: 'Rating must be between 1 and 5' }); return; }
    if (comment.trim().length < 10) { res.status(400).json({ error: 'Comment must be at least 10 characters' }); return; }

    // Must be enrolled
    const enrollment = await prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId: req.user!.userId, courseId } },
    });
    if (!enrollment) { res.status(403).json({ error: 'You must be enrolled to review this course' }); return; }

    const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
    const review = await prisma.review.create({
      data: { courseId, studentId: req.user!.userId, studentName: user!.name, rating, comment: comment.trim() },
    });

    // Recalculate course rating
    const agg = await prisma.review.aggregate({ where: { courseId }, _avg: { rating: true }, _count: { rating: true } });
    await prisma.course.update({
      where: { id: courseId },
      data: { rating: Math.round((agg._avg.rating || 0) * 10) / 10, reviewCount: agg._count.rating },
    });

    res.status(201).json({ review });
  } catch (err: any) {
    if (err.code === 'P2002') { res.status(409).json({ error: 'You have already reviewed this course' }); return; }
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

// PATCH /api/reviews/:id
router.patch('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { rating, comment } = req.body;
    const review = await prisma.review.findUnique({ where: { id: req.params.id } });
    if (!review) { res.status(404).json({ error: 'Review not found' }); return; }
    if (review.studentId !== req.user!.userId) { res.status(403).json({ error: 'Not your review' }); return; }
    const updated = await prisma.review.update({ where: { id: req.params.id }, data: { rating, comment } });
    const agg = await prisma.review.aggregate({ where: { courseId: review.courseId }, _avg: { rating: true }, _count: { rating: true } });
    await prisma.course.update({ where: { id: review.courseId }, data: { rating: Math.round((agg._avg.rating || 0) * 10) / 10, reviewCount: agg._count.rating } });
    res.json({ review: updated });
  } catch {
    res.status(500).json({ error: 'Failed to update review' });
  }
});

// DELETE /api/reviews/:id
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const review = await prisma.review.findUnique({ where: { id: req.params.id } });
    if (!review) { res.status(404).json({ error: 'Review not found' }); return; }
    if (review.studentId !== req.user!.userId && req.user!.role !== 'ADMIN') { res.status(403).json({ error: 'Not your review' }); return; }
    await prisma.review.delete({ where: { id: req.params.id } });
    const agg = await prisma.review.aggregate({ where: { courseId: review.courseId }, _avg: { rating: true }, _count: { rating: true } });
    await prisma.course.update({ where: { id: review.courseId }, data: { rating: Math.round((agg._avg.rating || 0) * 10) / 10, reviewCount: agg._count.rating } });
    res.json({ message: 'Review deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

export default router;
