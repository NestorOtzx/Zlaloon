const express = require('express');
const router = express.Router();
const postcontroller = require('../controllers/postcontroll');


router.post('/makepost', postcontroller.makepost);


router.get('/getprofileposts', postcontroller.getprofileposts);

module.exports = router;
