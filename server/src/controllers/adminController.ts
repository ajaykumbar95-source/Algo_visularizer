import type { Response } from 'express';
import prisma from '../db.js';
import type { AuthRequest } from '../middleware/auth.js';

export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await (prisma.user as any).findMany({
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
        _count: {
          select: { histories: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  const { userId } = req.params as { userId: string };

  try {
    // Check if user exists
    const user = await (prisma.user as any).findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Don't allow deleting the last admin or yourself
    if (user.role === 'ADMIN') {
      const adminCount = await (prisma.user as any).count({ where: { role: 'ADMIN' } });
      if (adminCount <= 1) {
        res.status(400).json({ error: 'Cannot delete the last administrator' });
        return;
      }
    }

    if (userId === req.user?.userId) {
      res.status(400).json({ error: 'You cannot delete your own account' });
      return;
    }

    // Delete related histories first
    await prisma.history.deleteMany({ where: { userId: userId as string } });
    await prisma.user.delete({ where: { id: userId as string } });

    res.status(200).json({ message: 'User and their history deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateUserRole = async (req: AuthRequest, res: Response): Promise<void> => {
  const { userId } = req.params as { userId: string };
  const { role } = req.body;

  if (!['USER', 'ADMIN'].includes(role)) {
    res.status(400).json({ error: 'Invalid role' });
    return;
  }

  try {
    const user = await (prisma.user as any).update({
      where: { id: userId },
      data: { role },
      select: { id: true, username: true, role: true }
    });

    res.status(200).json(user);
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
