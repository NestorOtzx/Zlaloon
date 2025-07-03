const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const usercontroller = require('../controllers/usercontroll');

router.get('/getprofileslike', usercontroller.getprofileslike);
router.get('/getprofilebyusername', usercontroller.getprofilebyusername);
router.get('/getfollowers', usercontroller.getfollowers);
router.get('/getfollowing', usercontroller.getfollowing);
router.get('/getisfollowing', usercontroller.getisfollowing);

router.post('/followprofile', usercontroller.followprofile);
router.post('/unfollowprofile', usercontroller.unfollowprofile);

router.post('/updateprofileimages',
  upload.fields([
    { name: 'profilepicture', maxCount: 1 },
    { name: 'backgroundimage', maxCount: 1 }
  ]),
  usercontroller.updateprofileimages
);

router.delete('/deleteaccount', usercontroller.deleteaccount)

module.exports = router;
