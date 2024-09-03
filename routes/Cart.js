const express = require('express');
const router = express.Router();
const cartController = require('../controllers/CartController');
const auth = require('../middleware/auth');

router.get('/cart', auth, cartController.getCart);
router.post('/cart/add', auth, cartController.addToCart);
router.post('/cart/remove', auth, cartController.removeFromCart);

module.exports = router;
