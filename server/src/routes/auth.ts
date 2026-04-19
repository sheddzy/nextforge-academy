import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../lib/prisma';
import { signToken, signRefreshToken, verifyRefreshToken } from '../lib/jwt';
import { authenticate, AuthRequest } from '../middleware/auth';
import { sendWelcomeEmail, sendPasswordResetEmail } from '../lib/email';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email and password are required' });
      return;
    }
    if (password.length < 8) {
      res.status(400).json({ error: 'Password must be at least 8 characters' });
      return;
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const userRole = role === 'INSTRUCTOR' ? 'INSTRUCTOR' : 'STUDENT';
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: userRole as any,
        isVerified: true,
        isApproved: userRole === 'STUDENT',
      },
      select: { id: true, name: true, email: true, role: true, isVerified: true, isApproved: true, createdAt: true },
    });
    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    const refreshToken = signRefreshToken({ userId: user.id, email: user.email, role: user.role });
    // Send welcome email (non-blocking)
    sendWelcomeEmail(email, name).catch(console.error);
    res.status(201).json({ user, token, refreshToken });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: 'No account found with this email' });
      return;
    }
    if (user.isSuspended) {
      res.status(403).json({ error: 'Your account has been suspended' });
      return;
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: 'Invalid password' });
      return;
    }
    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    const refreshToken = signRefreshToken({ userId: user.id, email: user.email, role: user.role });
    const { passwordHash, ...safeUser } = user;
    res.json({ user: safeUser, token, refreshToken });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST /api/auth/refresh
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) { res.status(400).json({ error: 'Refresh token required' }); return; }
    const payload = verifyRefreshToken(refreshToken);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user || user.isSuspended) { res.status(401).json({ error: 'Invalid session' }); return; }
    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    res.json({ token });
  } catch {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { id: true, name: true, email: true, role: true, bio: true, avatarUrl: true, isVerified: true, isApproved: true, isSuspended: true, createdAt: true },
    });
    if (!user) { res.status(404).json({ error: 'User not found' }); return; }
    res.json({ user });
  } catch {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) { res.json({ message: 'If that email exists, a reset link was sent' }); return; }
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour
    await prisma.passwordReset.create({ data: { userId: user.id, token, expiresAt } });
    const resetUrl = `${process.env.FRONTEND_URL || 'https://nextforgeacademy.online'}/reset-password?token=${token}`;
    await sendPasswordResetEmail(email, user.name, resetUrl);
    res.json({ message: 'If that email exists, a reset link was sent' });
  } catch {
    res.status(500).json({ error: 'Failed to process request' });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) { res.status(400).json({ error: 'Token and password required' }); return; }
    const reset = await prisma.passwordReset.findUnique({ where: { token } });
    if (!reset || reset.used || reset.expiresAt < new Date()) {
      res.status(400).json({ error: 'Invalid or expired reset token' }); return;
    }
    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.update({ where: { id: reset.userId }, data: { passwordHash } });
    await prisma.passwordReset.update({ where: { id: reset.id }, data: { used: true } });
    res.json({ message: 'Password reset successfully' });
  } catch {
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

export default router;
