const express = require('express');
const router = express.Router();
const homecontroll = require('../controllers/homecontroll');

router.get('/', (req, res) => {
    res.send("Hola mundo");
});

router.get('/home', homecontroll.home);

module.exports = router;
