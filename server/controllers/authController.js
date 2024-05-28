import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export const register = async (req, res) => {
  const { email, phone, name, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, phone, name, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'New user is added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error during user registration' });
  }
};
