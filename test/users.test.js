require('../app/models/User.model');
const mockingoose = require('mockingoose');
const mongoose = require('mongoose');
const userModel = mongoose.model('User');
const { secret } = require('../app/config');
const jwt = require('jsonwebtoken');

describe('User.model', () => {
  beforeEach(async () => {
    await userModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('should return the user with findById', () => {
    const mockUser = {
      _id: '507f191e810c19729de860ea',
      email: 'name@email.com',
    };

    mockingoose(userModel).toReturn(mockUser, 'findOne');

    return userModel.findById({ _id: '507f191e810c19729de860ea' }).then(doc => {
      expect(JSON.parse(JSON.stringify(doc))).toMatchObject(mockUser);
    });
  });

  describe('validPassword', () => {
    test('returns true if the password is valid', () => {
      const user = new userModel();
      user.setPassword('password');
      expect(user.validPassword('password')).toBe(true);
    });

    test('returns false if the password is invalid', () => {
      const user = new userModel();
      user.setPassword('password');
      expect(user.validPassword('invalidPassword')).toBe(false);
    });
  });

  describe('setPassword', () => {
    test('sets the salt and hash fields', () => {
      const user = new userModel();
      user.setPassword('password');
      expect(user.salt).toBeDefined();
      expect(user.hash).toBeDefined();
    });
  });

  describe('createJWT', () => {
    test('returns a valid JWT', () => {
      const user = new userModel();
      user._id = '707f191e810c19729de860ea';
      const token = user.createJWT();
      const decoded = jwt.verify(token, secret);
      expect(decoded.id).toBe('707f191e810c19729de860ea');
    });
  });
  
  describe('email', () => {
    test('must be required', async () => {
      const user = new userModel({});
      const error = user.validateSync();
      expect(error.errors['email'].message).toEqual('is required');
    });

    test('must be unique', async () => {
      const user1 = new userModel({ email: 'test@example.com' });
      await user1.save();
      const user2 = new userModel({ email: 'test@example.com' });
      const res = user2.save()
      await expect(user2.save()).rejects.toThrow();
    });

    test('must be a valid email', async () => {
      const user = new userModel({ email: 'invalid_email' });
      const error = user.validateSync();
      expect(error.errors['email'].message).toEqual('is invalid');
    });
  });

});
