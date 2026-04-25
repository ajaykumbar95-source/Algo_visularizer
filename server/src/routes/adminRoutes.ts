import { Router } from 'express';
import { getAllUsers, deleteUser, updateUserRole } from '../controllers/adminController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = Router();

// All routes here require being an authenticated ADMIN
router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/users', getAllUsers);
router.patch('/users/:userId/role', updateUserRole);
router.delete('/users/:userId', deleteUser);

export default router;
