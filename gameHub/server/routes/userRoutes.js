const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.route('/create_user').post(userController.create_user);
router.route('/login_user').post(userController.login_user);

module.exports = router;
