import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticate, requireAdmin, requireInstructor, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/courses — public course listing
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { category, level, search, featured, page = '1', limit = '20' } = req.query as Record<string, string>;
    const where: any = { isPublished: true, isApproved: true };
    if (category) where.category = category;
    if (level) where.level = level.toUpperCase();
    if (featured === 'true') where.isFeatured = true;
    if (search) where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { tags: { has: search } },
    ];
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        include: { instructor: { select: { id: true, name: true, avatarUrl: true } }, modules: { include: { lessons: { select: { id: true, title: true, type: true, duration: true, isPreview: true, order: true } }, orderBy: { order: 'asc' } }, orderBy: { order: 'asc' } } },
        orderBy: { enrolledCount: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.course.count({ where }),
    ]);
    res.json({ courses, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// GET /api/courses/:slug
router.get('/:slug', async (req: AuthRequest, res: Response) => {
  try {
    const course = await prisma.course.findUnique({
      where: { slug: req.params.slug },
      include: {
        instructor: { select: { id: true, name: true, avatarUrl: true, bio: true } },
        modules: { include: { lessons: { orderBy: { order: 'asc' } } }, orderBy: { order: 'asc' } },
        reviews: { orderBy: { createdAt: 'desc' }, take: 20 },
      },
    });
    if (!course) { res.status(404).json({ error: 'Course not found' }); return; }
    res.json({ course });
  } catch {
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

// POST /api/courses — instructor creates course
router.post('/', authenticate, requireInstructor, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, longDescription, category, level, price, tags, requirements, whatYouLearn, duration } = req.body;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
    // Check instructor doesn't already have a course (unless admin)
    if (req.user!.role !== 'ADMIN') {
      const existing = await prisma.course.findFirst({ where: { instructorId: req.user!.userId } });
      if (existing) { res.status(400).json({ error: 'You already have a course. Submit a course request for additional courses.' }); return; }
    }
    const course = await prisma.course.create({
      data: {
        title, slug, description, longDescription: longDescription || description,
        category, level: level?.toUpperCase() || 'BEGINNER',
        price: parseFloat(price) || 0,
        isFree: parseFloat(price) === 0,
        tags: tags || [], requirements: requirements || [], whatYouLearn: whatYouLearn || [],
        duration: duration || '',
        instructorId: req.user!.userId,
      },
    });
    res.status(201).json({ course });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create course' });
  }
});

// PATCH /api/courses/:id — instructor updates their course
router.patch('/:id', authenticate, requireInstructor, async (req: AuthRequest, res: Response) => {
  try {
    const course = await prisma.course.findUnique({ where: { id: req.params.id } });
    if (!course) { res.status(404).json({ error: 'Course not found' }); return; }
    if (course.instructorId !== req.user!.userId && req.user!.role !== 'ADMIN') {
      res.status(403).json({ error: 'Not your course' }); return;
    }
    const { title, description, longDescription, category, level, tags, requirements, whatYouLearn, duration } = req.body;
    const updated = await prisma.course.update({
      where: { id: req.params.id },
      data: { title, description, longDescription, category, level: level?.toUpperCase(), tags, requirements, whatYouLearn, duration },
    });
    res.json({ course: updated });
  } catch {
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// PATCH /api/courses/:id/price — admin only
router.patch('/:id/price', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { price } = req.body;
    const updated = await prisma.course.update({
      where: { id: req.params.id },
      data: { price: parseFloat(price), isFree: parseFloat(price) === 0 },
    });
    res.json({ course: updated });
  } catch {
    res.status(500).json({ error: 'Failed to update price' });
  }
});

// PATCH /api/courses/:id/approve — admin only
router.patch('/:id/approve', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const updated = await prisma.course.update({
      where: { id: req.params.id },
      data: { isApproved: true, isPublished: true },
    });
    res.json({ course: updated });
  } catch {
    res.status(500).json({ error: 'Failed to approve course' });
  }
});

// PATCH /api/courses/:id/feature — admin only
router.patch('/:id/feature', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { featured } = req.body;
    const updated = await prisma.course.update({ where: { id: req.params.id }, data: { isFeatured: featured } });
    res.json({ course: updated });
  } catch {
    res.status(500).json({ error: 'Failed to update featured status' });
  }
});

// DELETE /api/courses/:id — admin only
router.delete('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.course.delete({ where: { id: req.params.id } });
    res.json({ message: 'Course deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

export default router;
