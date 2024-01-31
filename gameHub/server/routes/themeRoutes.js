const express = require('express');
const themeController = require('../controllers/themeController');
const router = express.Router();

router.route('/update_theme').put(themeController.update_theme);
router.route('/get_theme/:_id').get(themeController.get_theme);

module.exports = router;
