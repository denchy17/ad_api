import bcrypt from 'bcryptjs';
import { register, login } from '../controllers/authController.js';
import User from '../models/User.js';
import { sendTelegramNotification, initializeTelegramBot, stopTelegramBot } from '../utils/sendTelegramNotification.js';
import generateToken from '../utils/generateToken.js';

jest.mock('bcryptjs');
jest.mock('../models/User');
jest.mock('../utils/sendTelegramNotification.js');
jest.mock('../utils/generateToken.js', () => jest.fn());

initializeTelegramBot();

afterAll(() => {
    stopTelegramBot();
});

describe('Register Method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register a new user', async () => {
    const req = {
      body: {
        email: 'test@example.com',
        phone: '1234567890',
        name: 'Test User',
        password: 'password123'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    bcrypt.hash.mockResolvedValue('hashedPassword');

    const saveMock = jest.fn().mockResolvedValue();
    User.mockReturnValueOnce({ save: saveMock });

    await register(req, res);

    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    expect(User).toHaveBeenCalledWith({
      email: 'test@example.com',
      phone: '1234567890',
      name: 'Test User',
      password: 'hashedPassword'
    });
    expect(saveMock).toHaveBeenCalled();
    expect(sendTelegramNotification).toHaveBeenCalledWith(process.env.ADMIN_TELEGRAM_USERNAME, 'New user registered:\nName: Test User\nEmail: test@example.com');
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'New user is added successfully' });
  });

  it('should handle registration errors', async () => {
    const req = {
      body: {
        email: 'test@example.com',
        phone: '1234567890',
        name: 'Test User',
        password: 'password123'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    bcrypt.hash.mockRejectedValue(new Error('Bcrypt error'));

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error during user registration' });
  });
});

describe('Login Method', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should login a user successfully', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123'
        }
      };
      const res = {
        json: jest.fn()
      };
  
      const user = {
        _id: 'someUserId',
        role: 'user',
        password: 'hashedPassword'
      };
      User.findOne.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      generateToken.mockReturnValue('someGeneratedToken');
  
      await login(req, res);
  
      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
      expect(generateToken).toHaveBeenCalledWith('someUserId', 'user');
      expect(res.json).toHaveBeenCalledWith({ token: 'someGeneratedToken' });
    });
  
    it('should login an admin successfully', async () => {
      const req = {
        body: {
          email: 'admin@example.com',
          password: 'adminPassword123'
        }
      };
      const res = {
        json: jest.fn()
      };
  
      const adminUser = {
        _id: 'adminUserId',
        role: 'admin',
        password: 'hashedAdminPassword'
      };
      User.findOne.mockResolvedValue(adminUser);
      bcrypt.compare.mockResolvedValue(true);
      generateToken.mockReturnValue('adminToken123');
  
      await login(req, res);
  
      expect(User.findOne).toHaveBeenCalledWith({ email: 'admin@example.com' });
      expect(bcrypt.compare).toHaveBeenCalledWith('adminPassword123', 'hashedAdminPassword');
      expect(generateToken).toHaveBeenCalledWith('adminUserId', 'admin');
      expect(res.json).toHaveBeenCalledWith({ token: 'adminToken123' });
    });

    it('should handle login with incorrect password', async () => {
        const req = {
          body: {
            email: 'test@example.com',
            password: 'incorrectPassword'
          }
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn()
        };
    
        const user = {
          _id: 'someUserId',
          password: 'hashedPassword'
        };
        User.findOne.mockResolvedValue(user);
        bcrypt.compare.mockResolvedValue(false);
    
        await login(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Incorrect password' });
      });
    
      it('should handle login with non-existing user', async () => {
        const req = {
          body: {
            email: 'nonexistent@example.com',
            password: 'password123'
          }
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn()
        };
    
        User.findOne.mockResolvedValue(null);
    
        await login(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'There are no such user in system' });
      });
    
      it('should handle login errors', async () => {
        const req = {
          body: {
            email: 'test@example.com',
            password: 'password123'
          }
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn()
        };
    
        User.findOne.mockRejectedValue(new Error('Database error'));
    
        await login(req, res);
    
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Something went wrong with logining the user' });
      });
  });
