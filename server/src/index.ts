import dotenv from 'dotenv';
dotenv.config();
console.log('DATABASE_URL:', process.env.DATABASE_URL);

import express from 'express';
import cors from 'cors';
import traceRoutes from './routes/traceRoutes.js';
import authRoutes from './routes/authRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api', traceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', historyRoutes);
app.use('/api/admin', adminRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
