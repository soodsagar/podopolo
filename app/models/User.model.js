const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const secret = require('../config').secret;

const UserSchema = new mongoose.Schema({
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
}, { timestamps: true, versionKey: false });

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
    id: this._id,
    exp: parseInt(exp.getTime() / 1000),
  }, secret);
};

mongoose.model('User', UserSchema);
