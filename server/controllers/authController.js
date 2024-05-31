import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { validationResult } from 'express-validator';
import { sendTelegramNotification, initializeTelegramBot } from '../utils/sendTelegramNotification.js';
import asyncHandler from 'express-async-handler';

export const register = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, phone, name, password } = req.body;
    try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, phone, name, password: hashedPassword});
    await newUser.save();

    await initializeTelegramBot();
    await sendTelegramNotification(process.env.ADMIN_TELEGRAM_USERNAME, `New user registered:\nName: ${name}\nEmail: ${email}`);

    res.status(201).json({ message: 'New user is added successfully' });
    } catch (error) {
    res.status(500).json({ error: 'Error during user registration' });
    }
});

export const login = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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
  
      const token = generateToken(user._id, user.role);
  
      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong with logining the user' });
    }
  });