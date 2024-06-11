import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const getCurrentUser = async (userId) => {
  return await User.findById(userId).select('-password');
};

export const getAllUsers = async () => {
  return await User.find().select('-password');
};

export const deleteUserById = async (userId) => {
  return await User.findByIdAndDelete(userId);
};

export const updateUserById = async (userId, userData) => {
  const { email, phone, name, password } = userData;
  const userFields = { email, phone, name };

  if (password) {
    const salt = await bcrypt.genSalt(10);
    userFields.password = await bcrypt.hash(password, salt);
  }

  return await User.findByIdAndUpdate(userId, { $set: userFields }, { new: true });
};
