import type { Request, Response } from 'express';
import prisma from '../db.js';
import type { AuthRequest } from '../middleware/auth.js';

export const getHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const history = await prisma.history.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    res.status(200).json(history.map((h: any) => ({
      ...h,
      inputData: JSON.parse(h.inputData)
    })));
  } catch (error) {
    console.error('Get history error details:', error);
    res.status(500).json({ error: 'Internal server error', details: error instanceof Error ? error.message : String(error) });
  }
};

export const saveHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  const { algorithmId, inputData } = req.body;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (!algorithmId || !inputData) {
    res.status(400).json({ error: 'Missing algorithmId or inputData' });
    return;
  }

  try {
    const history = await prisma.history.create({
      data: {
        userId,
        algorithmId,
        inputData: JSON.stringify(inputData)
      }
    });

    res.status(201).json(history);
  } catch (error) {
    console.error('Save history error details:', error);
    res.status(500).json({ error: 'Internal server error', details: error instanceof Error ? error.message : String(error) });
  }
};
