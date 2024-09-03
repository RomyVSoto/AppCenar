const express = require("express");
const adminController = require("../controllers/AdminController");
const upload = require("../middleware/multer");
const auth = require('../middleware/auth');
const router = express.Router();

router.get("/admin", adminController.getList);

router.get('/admin/edit-user/:UserId', auth, adminController.getUserById);
router.post('/admin/edit-user', auth, upload.single('picture'), adminController.postEditUser);
router.post("/delete-user", adminController.postDeleteUser);

router.get('/admin/edit-commerce/:commerceId', auth, adminController.getCommerceById);
router.post('/admin/edit-commerce', auth, upload.single('picture'), adminController.postEditCommerce);
router.post("/delete-commerce", adminController.postDeleteCommerce);

router.get('/admin/edit-delivery/:deliveryId', auth, adminController.getDeliveryById);
router.post('/admin/edit-delivery', auth, upload.single('picture'), adminController.postEditDelivery);
router.post("/delete-delivery", adminController.postDeleteDelivery);

module.exports = router;
