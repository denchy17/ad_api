import { validationResult } from 'express-validator';
import { registerUser, loginUser } from '../services/authService.js';

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, phone, name, password } = req.body;
  try {
    await registerUser(email, phone, name, password);
    res.status(201).json({ message: 'New user is added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error during user registration' });
  }
}

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    const { token } = await loginUser(email, password);
    res.json({ token });
  } catch (error) {
    if (error.message === 'User not found' || error.message === 'Incorrect password') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Something went wrong with logging in the user' });
  }
}
