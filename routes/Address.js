const express = require('express');
const router = express.Router();
const addressController = require('../controllers/AddressController');
const auth = require('../middleware/auth');

router.get('/addresses', auth, addressController.getAddresses);
router.get('/addresses/add', auth, addressController.getAddAddress);
router.post('/addresses/add', auth, addressController.postAddAddress);
router.get('/addresses/edit/:addressId', auth, addressController.getEditAddress);
router.post('/addresses/edit', auth, addressController.postEditAddress);
router.post('/addresses/delete', auth, addressController.postDeleteAddress);

module.exports = router;
