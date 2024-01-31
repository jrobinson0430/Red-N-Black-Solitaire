const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const GameSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  rules: {
    type: String,
    required: true,
  },
  blurb: {
    type: String,
    required: true,
  },
  photo: {
    // will use formidable
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  gamesPlayed: {
    type: Number,
    default: 0,
  },
});

module.exports = model('Game', GameSchema);
