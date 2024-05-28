import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import User from '../models/User';

beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('POST /api/auth/register', () => {
  it('should register a new user', async () => {
    const userData = {
      email: 'test@example.com',
      phone: '1234567890',
      name: 'Test User',
      password: 'password123'
    };

    const response = await request(app).post('/api/auth/register').send(userData);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('New user is added successfully');

    const user = await User.findOne({ email: 'test@example.com' });
    expect(user).toBeTruthy();
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    await User.create({ email: 'test@example.com', phone: '1234567890', name: 'Test User', password: hashedPassword });
  });

  it('should login user with correct credentials', async () => {
    const loginData = { email: 'test@example.com', password: 'password123' };

    const response = await request(app).post('/api/auth/login').send(loginData);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should return 400 if user not found', async () => {
    const loginData = { email: 'nonexistent@example.com', password: 'password123' };

    const response = await request(app).post('/api/auth/login').send(loginData);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('There are no such user in system');
  });

  it('should return 400 if password is incorrect', async () => {
    const loginData = { email: 'test@example.com', password: 'wrongpassword' };

    const response = await request(app).post('/api/auth/login').send(loginData);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Incorrect password');
  });
});
