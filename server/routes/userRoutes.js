import express from 'express';
import { getCurrentUser, getAllUsers, deleteUser, updateUser } from '../controllers/userController.js';
import { protect, admin, adminOrOwner } from '../middlewares/auth.js';

const router = express.Router();

router.get('/me', protect, getCurrentUser);
router.get('/', protect, admin, getAllUsers);
router.delete('/:id', protect, adminOrOwner, deleteUser);
router.put('/:id', protect, adminOrOwner, updateUser);

export default router;
