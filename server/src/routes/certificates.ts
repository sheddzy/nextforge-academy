import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/certificates/my
router.get('/my', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const certificates = await prisma.certificate.findMany({
      where: { studentId: req.user!.userId },
      include: { course: { select: { title: true, thumbnailUrl: true } }, student: { select: { name: true } } },
      orderBy: { issuedAt: 'desc' },
    });
    res.json({ certificates });
  } catch {
    res.status(500).json({ error: 'Failed to fetch certificates' });
  }
});

// GET /api/certificates/verify/:number — public verification
router.get('/verify/:number', async (req: AuthRequest, res: Response) => {
  try {
    const cert = await prisma.certificate.findUnique({
      where: { certificateNumber: req.params.number },
      include: {
        course: { select: { title: true, category: true } },
        student: { select: { name: true } },
      },
    });
    if (!cert) { res.status(404).json({ error: 'Certificate not found' }); return; }
    res.json({ certificate: cert, valid: true });
  } catch {
    res.status(500).json({ error: 'Verification failed' });
  }
});

export default router;
