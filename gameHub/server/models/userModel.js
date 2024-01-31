const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { ScoreSchema } = require('./scoreModel');
const { Schema, model } = mongoose;
const SALT = 10;

const UserSchema = new Schema({
  userName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  highScores: [ScoreSchema],

  theme: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

UserSchema.pre('save', function (next) {
  bcrypt.genSalt(SALT, (error, salt) => {
    if (error) {
      return next(error);
    }

    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      this.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (loginPassword) {
  return bcrypt.compare(loginPassword, this.password);
};

module.exports = model('user', UserSchema);
