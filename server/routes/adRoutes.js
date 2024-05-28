import express from 'express';
import { getAds, getAdById, createAd, updateAd, deleteAd } from '../controllers/adController.js';
import isUserValidated from '../middlewares/isUserValidated.js';
import { validateAd } from '../validators/adValidation.js';

const router = express.Router();

router.route('/').get(getAds);
router.route('/').post(isUserValidated, validateAd, createAd);
router.route('/:id').put(isUserValidated, validateAd, updateAd);
router.route('/:id').delete(isUserValidated, deleteAd);
router.route('/:id').get(getAdById);

export default router;
