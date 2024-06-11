import * as adRepository from '../repositories/adRepository.js';

export const getAds = async () => {
  return await adRepository.getAds();
};

export const getAdById = async (adId) => {
  return await adRepository.getAdById(adId);
};

export const createAd = async (adData) => {
  return await adRepository.createAd(adData);
};

export const updateAdById = async (adId, updateData) => {
  return await adRepository.updateAdById(adId, updateData);
};

export const deleteAdById = async (adId) => {
  return await adRepository.deleteAdById(adId);
};
