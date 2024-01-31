const express = require('express');
const router = express.Router();
const gamesController = require('../controllers/gamesController');

router.route('/get_game_data').get(gamesController.get_game_data);
router
  .route('/update_games_played/:_id')
  .put(gamesController.update_games_played);
module.exports = router;
