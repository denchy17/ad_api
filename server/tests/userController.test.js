import { getCurrentUser, getAllUsers, deleteUser, updateUser } from '../controllers/userController';
  import User from '../models/User';
  
  jest.mock('../models/User');
  
  describe('User Controller', () => {
    describe('getCurrentUser', () => {
      it('should get the current user', async () => {
        const user = { _id: '123', name: 'Test User', email: 'test@example.com' };
        const req = { user: { id: '123' } };
        const res = {
          json: jest.fn(),
          status: jest.fn().mockReturnThis(),
        };
  
        User.findById.mockResolvedValue(user);
  
        await getCurrentUser(req, res);
  
        expect(User.findById).toHaveBeenCalledWith('123');
        expect(res.json).toHaveBeenCalledWith(user);
      });
  
      it('should handle errors', async () => {
        const req = { user: { id: '123' } };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
  
        User.findById.mockRejectedValue(new Error('Server error'));
  
        await getCurrentUser(req, res);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Server error' });
      });
    });
  
    describe('getAllUsers', () => {
      it('should get all users', async () => {
        const users = [
          { _id: '123', name: 'User 1', email: 'user1@example.com' },
          { _id: '456', name: 'User 2', email: 'user2@example.com' },
        ];
        const req = {};
        const res = {
          json: jest.fn(),
          status: jest.fn().mockReturnThis(),
        };
  
        User.find.mockResolvedValue(users);
  
        await getAllUsers(req, res);
  
        expect(User.find).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(users);
      });
  
      it('should handle errors', async () => {
        const req = {};
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
  
        User.find.mockRejectedValue(new Error('Server error'));
  
        await getAllUsers(req, res);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Server error' });
      });
    });
  
    describe('deleteUser', () => {
      it('should delete a user', async () => {
        const req = { params: { id: '123' } };
        const res = {
          json: jest.fn(),
          status: jest.fn().mockReturnThis(),
        };
  
        User.findById.mockResolvedValue({ remove: jest.fn().mockResolvedValue() });
  
        await deleteUser(req, res);
  
        expect(User.findById).toHaveBeenCalledWith('123');
        expect(res.json).toHaveBeenCalledWith({ message: 'User removed' });
      });
  
      it('should handle user not found', async () => {
        const req = { params: { id: '123' } };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
  
        User.findById.mockResolvedValue(null);
  
        await deleteUser(req, res);
  
        expect(User.findById).toHaveBeenCalledWith('123');
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
      });
  
      it('should handle errors', async () => {
        const req = { params: { id: '123' } };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
  
        User.findById.mockRejectedValue(new Error('Server error'));
  
        await deleteUser(req, res);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Server error' });
      });
    });
  
    describe('updateUser', () => {
      it('should update a user', async () => {
        const req = {
          params: { id: '123' },
          body: { name: 'Updated Name' },
          user: { id: '123' },
        };
        const res = {
          json: jest.fn(),
        };
  
        const updatedUser = { _id: '123', name: 'Updated Name', email: 'test@example.com' };
  
        User.findById.mockResolvedValue({
          id: '123',
          save: jest.fn().mockResolvedValue(updatedUser),
        });
  
        await updateUser(req, res);
  
        expect(User.findById).toHaveBeenCalledWith('123');
        expect(res.json).toHaveBeenCalledWith(updatedUser);
      });
  
      it('should handle user not found', async () => {
        const req = { params: { id: '123' } };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
  
        User.findById.mockResolvedValue(null);
  
        await updateUser(req, res);
  
        expect(User.findById).toHaveBeenCalledWith('123');
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
      });
  
      it('should handle unauthorized access', async () => {
        const req = {
          params: { id: '456' },
          body: { name: 'Updated Name' },
          user: { id: '123', role: 'user' },
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
  
        User.findById.mockResolvedValue({ id: '456' });
  
        await updateUser(req, res);
  
        expect(User.findById).toHaveBeenCalledWith('456');
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: 'Access denied' });
      });
  
      it('should handle errors', async () => {
        const req = { params: { id: '123' }, body: { name: 'Updated Name' } };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
  
        User.findById.mockRejectedValue(new Error('Server error'));
  
        await updateUser(req, res);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Server error' });
      });
    });
  });
  