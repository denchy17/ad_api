import Ad from '../models/Ad.js';

export const getAds = async () => {
  return await Ad.find({});
};

export const getAdById = async (adId) => {
  return await Ad.findById(adId);
};

export const createAd = async (adData) => {
  const ad = new Ad(adData);
  return await ad.save();
};

export const updateAdById = async (adId, updateData) => {
  const ad = await Ad.findById(adId);
  if (!ad) {
    throw new Error('Ad not found');
  }

  Object.assign(ad, updateData);
  return await ad.save();
};

export const deleteAdById = async (adId) => {
  const ad = await Ad.findById(adId);
  if (!ad) {
    throw new Error('Ad not found');
  }

  await ad.deleteOne();
};
