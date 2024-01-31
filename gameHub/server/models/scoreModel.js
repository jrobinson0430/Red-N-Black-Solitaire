const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const ScoreSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  gameName: {
    type: String,
    default: 'redNBlack',
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  time: {
    type: String,
    default: '',
    required: true,
  },
  moves: {
    type: Number,
    default: 0,
    required: true,
  },
});

const Score = model('score', ScoreSchema);

module.exports = { Score, ScoreSchema };
