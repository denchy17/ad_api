import asyncHandler from 'express-async-handler';
import Ad from '../models/Ad.js';
import { validationResult } from 'express-validator';

const getAds = asyncHandler(async (req, res) => {
    try {
        const ads = await Ad.find({});
        res.json(ads);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const getAdById = asyncHandler(async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.id);

        if (ad) {
            res.json(ad);
        } else {
            res.status(404);
            throw new Error('Ad not found');
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const createAd = asyncHandler(async (req, res) => {
    const { title, description, price } = req.body;

    const ad = new Ad({
        title,
        description,
        price,
        creator: req.user._id,
    });

    try {
        const createdAd = await ad.save();
        res.status(201).json(createdAd);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const updateAd = asyncHandler(async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const ad = await Ad.findById(req.params.id);

        if (ad && (ad.user.equals(req.user._id) || req.user.role === 'admin')) {
            ad.title = req.body.title || ad.title;
            ad.description = req.body.description || ad.description;
            ad.price = req.body.price || ad.price;

            const updatedAd = await ad.save();
            res.json(updatedAd);
        } else {
            res.status(404);
            throw new Error('Ad not found or not authorized');
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const deleteAd = asyncHandler(async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.id);

        if (ad && (ad.user.equals(req.user._id) || req.user.role === 'admin')) {
            await ad.remove();
            res.json({ message: 'Ad removed' });
        } else {
            res.status(404);
            throw new Error('Ad not found or not authorized');
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export { getAds, getAdById, createAd, updateAd, deleteAd };
