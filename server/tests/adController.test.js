import { createAd, updateAd, deleteAd } from '../controllers/adController';
  import Ad from '../models/Ad';
  
  jest.mock('../models/Ad');
  
  describe('Ad Controller', () => {
    describe('createAd', () => {
      it('should create a new ad', async () => {
        const req = {
          body: {
            title: 'New Ad',
            description: 'Description of the new ad',
            price: 150,
            user: { _id: 'userId' },
          },
          user: { _id: 'userId' },
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
  
        Ad.prototype.save.mockResolvedValue({
          _id: 'newAdId',
          title: 'New Ad',
          description: 'Description of the new ad',
          price: 150,
          user: 'userId',
        });
  
        await createAd(req, res);
  
        expect(Ad.prototype.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
          _id: 'newAdId',
          title: 'New Ad',
          description: 'Description of the new ad',
          price: 150,
          user: 'userId',
        });
      });
  
      it('should handle errors during ad creation', async () => {
        const req = {
          body: {
            title: 'New Ad',
            description: 'Description of the new ad',
            price: 150,
          },
          user: { _id: 'userId' },
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
  
        Ad.prototype.save.mockRejectedValue(new Error('Validation error'));
  
        await createAd(req, res);
  
        expect(Ad.prototype.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Validation error' });
      });
    });
  
    describe('updateAd', () => {
      it('should update an existing ad', async () => {
        const req = {
          params: { id: 'existingAdId' },
          body: { title: 'Updated Ad' },
          user: { _id: 'userId' },
        };
        const res = {
          json: jest.fn(),
        };
  
        Ad.findById.mockResolvedValue({
          _id: 'existingAdId',
          title: 'Existing Ad',
          description: 'Description of the existing ad',
          price: 100,
          user: 'userId',
          save: jest.fn().mockResolvedValue({
            _id: 'existingAdId',
            title: 'Updated Ad',
            description: 'Description of the existing ad',
            price: 100,
            user: 'userId',
          }),
        });
  
        await updateAd(req, res);
  
        expect(Ad.findById).toHaveBeenCalledWith('existingAdId');
        expect(res.json).toHaveBeenCalledWith({
          _id: 'existingAdId',
          title: 'Updated Ad',
          description: 'Description of the existing ad',
          price: 100,
          user: 'userId',
        });
      });
  
      it('should handle ad not found during update', async () => {
        const req = {
          params: { id: 'nonExistingAdId' },
          body: { title: 'Updated Ad' },
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
  
        Ad.findById.mockResolvedValue(null);
  
        await updateAd(req, res);
  
        expect(Ad.findById).toHaveBeenCalledWith('nonExistingAdId');
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Ad not found or not authorized' });
      });
    });
  
    describe('deleteAd', () => {
      it('should delete an existing ad', async () => {
        const req = {
          params: { id: 'existingAdId' },
          user: { _id: 'userId' },
        };
        const res = {
          json: jest.fn(),
        };
  
        Ad.findById.mockResolvedValue({
          _id: 'existingAdId',
          title: 'Existing Ad',
          description: 'Description of the existing ad',
          price: 100,
          user: 'userId',
          remove: jest.fn().mockResolvedValue({ message: 'Ad removed' }),
        });
  
        await deleteAd(req, res);
  
        expect(Ad.findById).toHaveBeenCalledWith('existingAdId');
        expect(res.json).toHaveBeenCalledWith({ message: 'Ad removed' });
      });
  
      it('should handle ad not found during delete', async () => {
        const req = {
          params: { id: 'nonExistingAdId' },
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
  
        Ad.findById.mockResolvedValue(null);
  
        await deleteAd(req, res);
  
        expect(Ad.findById).toHaveBeenCalledWith('nonExistingAdId');
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Ad not found or not authorized' });
      });
    });
  });
  