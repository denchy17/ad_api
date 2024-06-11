import User from '../models/User.js';

export const createUser = async (userData) => {
  const user = new User(userData);
  await user.save();
  return user;
};

export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};
