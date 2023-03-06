const request = require('supertest');
const server = require('../index');
const mongoose = require('mongoose');
const User = mongoose.model('User');

describe('Authentication Endpoints', () => {
  beforeAll(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    server.close();
    await mongoose.connection.close();
  });

  test('should create a new user account', async () => {
    const response = await request(server)
      .post('/api/auth/signup')
      .send({
        user: {
          email: 'testuser@test.com',
          password: 'testpassword'
        }
      })
      .expect(200);

      expect(response.body.user.id).toBeDefined();

  });

  test('should log in to an existing user account and receive an access token', async () => {
    await request(server)
      .post('/api/auth/signup')
      .send({
        user: {
          email: 'testuser@test.com',
          password: 'testpassword'
        }
      });

    const response = await request(server)
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

