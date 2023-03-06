require('../app/models/User.model');
const mockingoose = require('mockingoose');
const mongoose = require('mongoose');
const userModel = mongoose.model('User');

describe('User.model', () => {
  it('should return the user with findById', () => {
    const mockUser = {
      _id: '507f191e810c19729de860ea',
      email: 'name@email.com',
    };

    mockingoose(userModel).toReturn(mockUser, 'findOne');

    return userModel.findById({ _id: '507f191e810c19729de860ea' }).then(doc => {
      expect(JSON.parse(JSON.stringify(doc))).toMatchObject(mockUser);
    });
  });
});
