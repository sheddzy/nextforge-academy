import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/users — admin only
router.get('/', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { role, search } = req.query as Record<string, string>;
    const where: any = {};
    if (role) where.role = role.toUpperCase();
    if (search) where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
    const users = await prisma.user.findMany({
      where,
      select: { id: true, name: true, email: true, role: true, isVerified: true, isApproved: true, isSuspended: true, createdAt: true, bio: true, avatarUrl: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ users });
  } catch {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// PATCH /api/users/me — update own profile
router.patch('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { name, bio } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: { name, bio },
      select: { id: true, name: true, email: true, role: true, bio: true, avatarUrl: true, isVerified: true, isApproved: true, createdAt: true },
    });
    res.json({ user });
  } catch {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// PATCH /api/users/me/password
router.patch('/me/password', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
    if (!user) { res.status(404).json({ error: 'User not found' }); return; }
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) { res.status(401).json({ error: 'Current password incorrect' }); return; }
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
    res.json({ message: 'Password updated' });
  } catch {
    res.status(500).json({ error: 'Failed to update password' });
  }
});

// PATCH /api/users/:id/suspend — admin toggle suspend
router.patch('/:id/suspend', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) { res.status(404).json({ error: 'User not found' }); return; }
    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { isSuspended: !user.isSuspended },
      select: { id: true, isSuspended: true },
    });
    res.json({ user: updated });
  } catch {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// PATCH /api/users/:id/approve — admin approve instructor
router.patch('/:id/approve', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { isApproved: true },
      select: { id: true, isApproved: true },
    });
    res.json({ user: updated });
  } catch {
    res.status(500).json({ error: 'Failed to approve user' });
  }
});

export default router;
