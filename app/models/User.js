const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const secret = require('../config').secret;

const UserSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true, 
  },
  email: {
    type: String, 
    lowercase: true, 
    unique: true, 
    required: [true, 'is required'], 
    match: [/\S+@\S+\.\S+/, 'is invalid'], 
    index: true
  },
  hash: String,
  salt: String,
}, { timestamps: true });

UserSchema.methods.validPassword = function(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

UserSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.createJWT = function() {
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    id: this.id, // uses our uuid instead of mongodb object id, for extra security
    exp: parseInt(exp.getTime() / 1000),
  }, secret);
};

mongoose.model('User', UserSchema);
