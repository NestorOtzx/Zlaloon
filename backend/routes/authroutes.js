const express = require('express');
const router = express.Router();
const authcontroll = require('../controllers/authcontroll');

router.post('/signup', authcontroll.signUpController);
router.post('/login', authcontroll.loginController);

module.exports = router;
