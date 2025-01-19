const express = require('express');
const router = express.Router();
const postcontroller = require('../controllers/postcontroll');


router.post('/makepost', postcontroller.makepost);
router.post('/addlike', postcontroller.addlike);
router.post('/adddislike', postcontroller.adddislike);
router.post('/removelike', postcontroller.removelike);
router.post('/removedislike', postcontroller.removedislike);
router.post('/addshare', postcontroller.addshare);
router.post('/removeshare', postcontroller.removeshare);


router.get('/getprofileposts', postcontroller.getprofileposts);
router.get('/getpostslike', postcontroller.getpostslike);


module.exports = router;
