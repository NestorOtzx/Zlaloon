const express = require('express');
const router = express.Router();
const postcontroller = require('../controllers/postcontroll');
const upload = require('../config/multer'); // importar multer configurado

router.post(
  '/makepost',
  upload.array('images', 4), // campo 'images' y hasta 4 imágenes
  postcontroller.makepost
);

router.post('/addlike', postcontroller.addlike);
router.post('/adddislike', postcontroller.adddislike);
router.post('/removelike', postcontroller.removelike);
router.post('/removedislike', postcontroller.removedislike);
router.post('/addshare', postcontroller.addshare);
router.post('/removeshare', postcontroller.removeshare);

router.get('/getprofilepost', postcontroller.getprofilepost)
router.get('/getprofileposts', postcontroller.getprofileposts);
router.get('/getpostslike', postcontroller.getpostslike);
router.get('/getpostreplies', postcontroller.getpostreplies);

router.delete('/deletepost', postcontroller.deletepost);



module.exports = router;
