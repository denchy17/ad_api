import { check } from 'express-validator';

export const validateAd = [
  check('title', 'Title is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
  check('price', 'Price is required').not().isEmpty().isNumeric(),
];
