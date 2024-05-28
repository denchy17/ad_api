import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const register = async (req, res) => {
  const { email, phone, name, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, phone, name, password: hashedPassword});
    await newUser.save();

    res.status(201).json({ message: 'New user is added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error during user registration' });
  }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: 'There are no such user in system' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Incorrect password' });
      }
  
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '1h'
      });
  
      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong with logining the user' });
    }
  };