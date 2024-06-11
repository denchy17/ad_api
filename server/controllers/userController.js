import { validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';
import * as userService from '../services/userService.js';

export const getCurrentUser = asyncHandler(async (req, res) => {
  try {
    const user = await userService.getCurrentUser(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export const deleteUser = asyncHandler(async (req, res) => {
  try {
    const user = await userService.deleteUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export const updateUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await userService.updateUserById(req.params.id, req.body);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});
