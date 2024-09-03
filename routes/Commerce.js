const express = require('express');
const router = express.Router();
const commerceController = require('../controllers/CommerceController'); 
const auth = require("../middleware/auth");

// Rutas para listar y editar productos
router.get('/commerce/inventory', commerceController.listInventory);

router.get('/commerce/products/add', commerceController.getAddProduct);
router.post('/commerce/products/add', commerceController.postAddProduct);
router.get('/products/edit/:productId', commerceController.getEditProduct);
router.post('/products/edit', commerceController.postEditProduct);
router.post('/products/delete', commerceController.postDeleteProduct);

router.get('/commerce/category/add', commerceController.getAddCategory);
router.post('/commerce/category/add', commerceController.postAddCategory);
router.get('/category/edit/:categoryId', commerceController.getEditCategory);
router.post('/category/edit', commerceController.postEditCategory);
router.post('/category/delete', commerceController.postDeleteCategory);

// Nueva ruta para ver un comercio específico
router.get('/commerce/:commerceId/products', commerceController.getProducts);


module.exports = router;
