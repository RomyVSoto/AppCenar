const Product = require('../models/Product');
const Commerce = require('../models/Commerce');

exports.getCart = async (req, res, next) => {
  const cart = req.session.cart || [];
  const subtotal = cart.reduce((sum, product) => sum + parseFloat(product.price), 0);
  const itbis = subtotal * 0.18;
  const total = subtotal + itbis;

  res.render('cart', {
    pageTitle: 'Your Cart',
    cart,
    hasItems: cart.length > 0,
    subtotal: subtotal.toFixed(2),
    itbis: itbis.toFixed(2),
    total: total.toFixed(2)
  });
};

exports.addToCart = async (req, res, next) => {
  const { productId } = req.body;
  const product = await Product.findByPk(productId, { include: Commerce });

  if (!product) {
    req.flash('errors', 'Product not found');
    return res.redirect('/');
  }

  const cart = req.session.cart || [];
  cart.push({
    id: product.id,
    name: product.name,
    price: parseFloat(product.price),  
    description: product.description,
    commerceName: product.Commerce.name
  });
  req.session.cart = cart;

  req.flash('success', 'Product added to cart');
  res.redirect('/cart');
};

exports.removeFromCart = (req, res, next) => {
  const { productId } = req.body;
  let cart = req.session.cart || [];
  cart = cart.filter(product => product.id !== parseInt(productId));
  req.session.cart = cart;

  req.flash('success', 'Product removed from cart');
  res.redirect('/cart');
};
