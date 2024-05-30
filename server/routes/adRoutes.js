import express from 'express';
import { getAds, getAdById, createAd, updateAd, deleteAd } from '../controllers/adController.js';
import isUserValidated from '../middlewares/isUserValidated.js';
import { validateAd } from '../validators/adValidation.js';
import { adminOrOwner } from '../middlewares/auth.js';

const router = express.Router();

router.route('/').get(getAds);
router.route('/').post(isUserValidated, validateAd, createAd);
router.route('/:id').put(isUserValidated, adminOrOwner, validateAd, updateAd);
router.route('/:id').delete(isUserValidated, adminOrOwner, deleteAd);
router.route('/:id').get(getAdById);

export default router;
