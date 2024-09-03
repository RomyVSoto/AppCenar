const express = require("express");
const authController = require("../controllers/AuthController");
const upload = require("../middleware/multer");
const router = express.Router();

router.get("/login", authController.GetLogin);
router.post("/login", authController.PostLogin);
router.post("/logout", authController.Logout);
router.get("/signup", authController.GetSignup);
router.post("/signup", upload.single('picture'), authController.PostSignup);

router.get("/signup-commerce", authController.GetSignupCommerce);
router.post("/signup-commerce", upload.single('picture'), authController.PostSignupCommerce);

router.get("/signup-delivery", authController.GetSignupDelivery);
router.post("/signup-delivery", upload.single('picture'), authController.PostSignupDelivery);

router.get('/forgot-password', (req, res) => {
    res.render('auth/forgot-password', { pageTitle: 'Forgot Password' });
  });
router.post('/forgot-password', authController.postForgotPassword);
router.get('/reset-password/:token', authController.getResetPassword);
router.post('/reset-password', authController.postResetPassword);

module.exports = router;