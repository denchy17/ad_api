import express from 'express';
import { getCurrentUser, getAllUsers, deleteUser, updateUser } from '../controllers/userController.js';
import { protect, admin } from '../middlewares/auth.js';

const router = express.Router();

router.get('/me', protect, getCurrentUser);
router.get('/', protect, admin, getAllUsers);
router.delete('/:id', protect, admin, deleteUser);
router.put('/:id', protect, updateUser);

export default router;
