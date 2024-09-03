const Product = require('../models/Product');
const Category = require('../models/Category');
const Commerce = require('../models/Commerce');
////
exports.listInventory = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      include: [Category, Commerce]
    });
    const categories = await Category.findAll();
    res.render('appcenar/commerce/inventory', { products, categories, pageTitle: 'Inventory' });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.getEditProduct = async (req, res, next) => {
  const { productId } = req.params;
  try {
    const product = await Product.findByPk(productId, {
      include: [Category]
    });
    const categories = await Category.findAll();
    if (!product) {
      req.flash('errors', 'Product not found');
      return res.redirect('/commerce/inventory');
    }
    if (!categories) {
      req.flash('errors', 'Category not found');
      return res.redirect('/commerce/inventory');
    }
    res.render('appcenar/commerce/edit-product', { product, categories, pageTitle: 'Edit Product' });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.postEditProduct = async (req, res, next) => {
  const { productId, name, price, description, categoryId } = req.body;
  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      req.flash('errors', 'Product not found');
      return res.redirect('/commerce/inventory');
    }
    product.name = name;
    product.price = price;
    product.description = description;
    product.categoryId = categoryId;
    await product.save();
    req.flash('success', 'Product updated successfully');
    res.redirect('/commerce/inventory');
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.getAddProduct = async (req, res, next) => {
    try {
        const commerces = await Commerce.findAll();
        const categories = await Category.findAll();
        res.render('appcenar/commerce/add-product', { commerces, categories, pageTitle: 'Add Product' });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

exports.postAddProduct = async (req, res, next) => {
  const { name, price, description, commerceId, categoryId } = req.body;
  try {
      const commerce = await Commerce.findByPk(commerceId);
      if (!commerce) {
          req.flash('errors', 'Commerce not found');
          return res.redirect('/commerce/inventory');
      }
      await Product.create({
          name,
          price,
          description,
          commerceId,
          categoryId
      });
      req.flash('success', 'Product added successfully');
      res.redirect('/commerce/inventory');
  } catch (err) {
      console.error(err);
      next(err);
  }
};

exports.postDeleteProduct = async (req, res, next) => {
  const { productId } = req.body;
  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      req.flash('errors', 'Product not found');
      return res.redirect('/commerce/inventory');
    }
    await product.destroy();
    req.flash('success', 'Product deleted successfully');
    res.redirect('/commerce/inventory');
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.getProducts = async (req, res, next) => {
  const commerceId = req.params.commerceId;
  try {
    const commerce = await Commerce.findByPk(commerceId, { include: { model: Product, as: 'products' } });
    if (!commerce) {
      req.flash('errors', 'No se encontró el comercio.');
      return res.redirect('/');
    }

    res.render('appcenar/commerce/commerce-products', {
      pageTitle: 'Commerce Products',
      products: commerce.products,
      hasProducts: commerce.products.length > 0
    });
  } catch (err) {
    console.error(err);
    req.flash('errors', 'Ocurrió un error al obtener los productos.');
    res.redirect('/');
  }
};

exports.getAddCategory = async (req, res, next) => {
  try {
    res.render('appcenar/commerce/add-category', { pageTitle: 'Add Category' });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.postAddCategory = async (req, res, next) => {
  const { name, description } = req.body;
  try {
    await Category.create({ name, description });
    req.flash('success', 'Category added successfully');
    res.redirect("/commerce/inventory");
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.getEditCategory = async (req, res, next) => {
  const { categoryId } = req.params;
  try {
    const category = await Category.findByPk(categoryId);
    if (!category) {
      req.flash('errors', 'Category not found');
      return res.redirect('/commerce/inventory');
    }
    res.render('appcenar/commerce/edit-category', { category, pageTitle: 'Edit Category' });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.postEditCategory = async (req, res, next) => {
  const { categoryId, name, description } = req.body;
  try {
    const category = await Category.findByPk(categoryId);
    if (!category) {
      req.flash('errors', 'Category not found');
      return res.redirect('/commerce/inventory');
    }
    category.name = name;
    category.description = description;
    await category.save();
    req.flash('success', 'Category updated successfully');
    res.redirect('/commerce/inventory');
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.postDeleteCategory = async (req, res, next) => {
  const { categoryId } = req.body;
  try {
    const category = await Category.findByPk(categoryId);
    if (!category) {
      req.flash('errors', 'Category not found');
      return res.redirect('/commerce/inventory');
    }
    await category.destroy();
    req.flash('success', 'Category deleted successfully');
    res.redirect('/commerce/inventory');
  } catch (err) {
    console.error(err);
    next(err);
  }
};
