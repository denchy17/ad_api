import { getAds, getAdById, createAd, updateAd, deleteAd } from '../controllers/adController';
import Ad from '../models/Ad';
import { validationResult } from 'express-validator';

jest.mock('../models/Ad');
jest.mock('express-validator');

describe('adController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAds', () => {
    it('should return all ads', async () => {
      const ads = [{ title: 'Ad1' }, { title: 'Ad2' }];
      Ad.find.mockResolvedValue(ads);

      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await getAds(req, res);

      expect(Ad.find).toHaveBeenCalledWith({});
      expect(res.json).toHaveBeenCalledWith(ads);
    });

    it('should handle errors', async () => {
      Ad.find.mockRejectedValue(new Error('Database error'));

      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await getAds(req, res);

      expect(Ad.find).toHaveBeenCalledWith({});
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

  describe('getAdById', () => {
    it('should return ad by ID', async () => {
      const ad = { _id: '1', title: 'Ad1' };
      Ad.findById.mockResolvedValue(ad);

      const req = { params: { id: '1' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await getAdById(req, res);

      expect(Ad.findById).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith(ad);
    });

    it('should return 404 if ad not found', async () => {
      Ad.findById.mockResolvedValue(null);

      const req = { params: { id: '1' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await getAdById(req, res);

      expect(Ad.findById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Ad not found' });
    });

    it('should handle errors', async () => {
      Ad.findById.mockRejectedValue(new Error('Database error'));

      const req = { params: { id: '1' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await getAdById(req, res);

      expect(Ad.findById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

  describe('createAd', () => {
    it('should create a new ad', async () => {
      const adData = { title: 'Ad1', description: 'Description', price: 100 };
      const ad = { _id: '1', ...adData, creator: 'userId' };
      Ad.prototype.save.mockResolvedValue(ad);

      const req = { body: adData, user: { _id: 'userId' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await createAd(req, res);

      expect(Ad.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(ad);
    });

    it('should handle validation errors', async () => {
      Ad.prototype.save.mockRejectedValue(new Error('Validation error'));

      const req = { body: {}, user: { _id: 'userId' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await createAd(req, res);

      expect(Ad.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Validation error' });
    });
  });

  describe('updateAd', () => {
    it('should update the ad', async () => {
      const ad = { _id: '1', title: 'Ad1', description: 'Description', price: 100, user: { equals: jest.fn().mockReturnValue(true) } };
      Ad.findById.mockResolvedValue(ad);
      validationResult.mockReturnValue({ isEmpty: jest.fn().mockReturnValue(true) });

      ad.save = jest.fn().mockResolvedValue(ad);

      const req = { params: { id: '1' }, body: { title: 'Updated Ad' }, user: { _id: 'userId', role: 'user' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await updateAd(req, res);

      expect(Ad.findById).toHaveBeenCalledWith('1');
      expect(ad.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(ad);
    });

    it('should return 404 if ad not found', async () => {
      Ad.findById.mockResolvedValue(null);

      const req = { params: { id: '1' }, body: {}, user: { _id: 'userId', role: 'user' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await updateAd(req, res);

      expect(Ad.findById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Ad not found' });
    });

    it('should handle validation errors', async () => {
      validationResult.mockReturnValue({ isEmpty: jest.fn().mockReturnValue(false), array: jest.fn().mockReturnValue([{ msg: 'Invalid data' }]) });

      const req = { params: { id: '1' }, body: {}, user: { _id: 'userId', role: 'user' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await updateAd(req, res);

      expect(validationResult).toHaveBeenCalledWith(req);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ errors: [{ msg: 'Invalid data' }] });
    });
  });

  describe('deleteAd', () => {
    it('should delete the ad', async () => {
      const ad = { _id: '1', user: { equals: jest.fn().mockReturnValue(true) } };
      Ad.findById.mockResolvedValue(ad);
      ad.deleteOne = jest.fn().mockResolvedValue({});

      const req = { params: { id: '1' }, user: { _id: 'userId', role: 'user' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await deleteAd(req, res);

      expect(Ad.findById).toHaveBeenCalledWith('1');
      expect(ad.deleteOne).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Ad removed' });
    });

    it('should return 404 if ad not found', async () => {
      Ad.findById.mockResolvedValue(null);

      const req = { params: { id: '1' }, user: { _id: 'userId', role: 'user' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await deleteAd(req, res);

      expect(Ad.findById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Ad not found' });
    });

    it('should handle errors', async () => {
      Ad.findById.mockRejectedValue(new Error('Database error'));

      const req = { params: { id: '1' }, user: { _id: 'userId', role: 'user' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await deleteAd(req, res);

      expect(Ad.findById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });
});
