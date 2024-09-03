const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require("../middleware/multer");
const mainController = require('../controllers/AppCenarController');
const profileController = require("../controllers/ProfileController");

router.get('/main', mainController.getMainPage);

router.get('/profile', auth, profileController.getProfile);
router.get('/profile/edit-profile/:UserId', auth, profileController.getEditProfile);
router.post('/profile/edit-profile/', auth, upload.single('picture'), profileController.postEditProfile);

module.exports = router;