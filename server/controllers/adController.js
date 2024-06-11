import { validationResult } from 'express-validator';
import * as adService from '../services/adService.js';

export const getAds = async (req, res) => {
  try {
    const ads = await adService.getAds();
    res.json(ads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const getAdById = async (req, res) => {
  try {
    const ad = await adService.getAdById(req.params.id);
    if (!ad) {
      res.status(404);
      throw new Error('Ad not found');
    }
    res.json(ad);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const createAd = async (req, res) => {
  const { title, description, price } = req.body;
  try {
    const createdAd = await adService.createAd(title, description, price, req.user._id);
    res.status(201).json(createdAd);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const updateAd = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updatedAd = await adService.updateAdById(req.params.id, req.body);
    res.json(updatedAd);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const deleteAd = async (req, res) => {
  try {
    await adService.deleteAdById(req.params.id);
    res.json({ message: 'Ad removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
