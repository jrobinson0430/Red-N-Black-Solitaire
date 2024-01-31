const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const themeSchema = new Schema({
  cardDeck: {
    type: String,
    default: 'science',
    required: true,
  },
  background: {
    type: String,
    default: 'background1',
    required: true,
  },
});

module.exports = model('theme', themeSchema);
 