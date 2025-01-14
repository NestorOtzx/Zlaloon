const express = require('express');
const router = express.Router();
const usercontroller = require('../controllers/usercontroll');

router.get('/getprofileslike', usercontroller.getprofileslike);
router.get('/getprofilebyusername', usercontroller.getprofilebyusername);
router.get('/getfollowers', usercontroller.getfollowers);
router.get('/getfollowing', usercontroller.getfollowing);
router.get('/getisfollowing', usercontroller.getisfollowing);

router.post('/followprofile', usercontroller.followprofile);
router.post('/unfollowprofile', usercontroller.unfollowprofile);

module.exports = router;
