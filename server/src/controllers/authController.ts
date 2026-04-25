import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] }
    });

    if (existingUser) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        role: (await prisma.user.count()) === 0 ? 'ADMIN' : 'USER' // First user is ADMIN
      }
    });

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ 
      token, 
      user: { id: user.id, email: user.email, username: user.username, role: user.role } 
    });
  } catch (error) {
    console.error('Signup error details:', error);
    res.status(500).json({ error: 'Internal server error', details: error instanceof Error ? error.message : String(error) });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ 
      token, 
      user: { id: user.id, email: user.email, username: user.username, role: user.role } 
    });
  } catch (error) {
    console.error('Login error details:', error);
    res.status(500).json({ error: 'Internal server error', details: error instanceof Error ? error.message : String(error) });
  }
};
