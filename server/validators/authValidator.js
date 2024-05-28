import { check } from 'express-validator';

export const validateRegister = [
  check('email', 'Please include a valid email').isEmail(),
  check('phone', 'Phone number is required').not().isEmpty(),
  check('name', 'Name is required').not().isEmpty(),
  check('password', 'Password should have 6 or more characters').isLength({ min: 6 })
];

export const validateLogin = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
];
