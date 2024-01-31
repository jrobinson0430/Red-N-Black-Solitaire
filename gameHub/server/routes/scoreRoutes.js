const express = require('express');
const scoreController = require('../controllers/scoreController');
const router = express.Router();

router.route('/set_score').post(scoreController.set_score);
router.route('/get_all_scores/:gameName').get(scoreController.get_all_scores);

router
  .route('/get_user_scores/:userId/:gameName')
  .get(scoreController.get_user_scores);

router
  .route('/delete_user_scores/:_id/:email')
  .delete(scoreController.delete_user_score);

module.exports = router;
