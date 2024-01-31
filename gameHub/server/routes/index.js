const express = require('express');
const userRoutes = require('./userRoutes');
const scoreRoutes = require('./scoreRoutes');
const themeRoutes = require('./themeRoutes');
const gameRoutes = require('./gameRoutes');

const router = express.Router();

router.use('/games', gameRoutes);

router.use('/user', userRoutes);
router.use('/score', scoreRoutes);
router.use('/theme', themeRoutes);

module.exports = router;
