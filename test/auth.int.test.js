const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const User = mongoose.model('User');

describe('Authentication Endpoints', () => {
  describe('POST /api/auth/signup', () => {
    beforeEach(async () => {
        await User.deleteMany({});
    });
    test('should create a new user account', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          user: {
            email: 'testuser@test.com',
            password: 'testpassword'
          }
        })
        .expect(201);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
        await request(app)
          .post('/api/auth/signup')
          .send({
            user: {
              email: 'testuser@test.com',
              password: 'testpassword'
            }
        });
    });

    test('should log in to an existing user account and receive an access token', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          user: {
            email: 'testuser@test.com',
            password: 'testpassword'
          }
        })
        .expect(200);
      expect(response.body.user.token).toBeDefined();
    });
  });
});
