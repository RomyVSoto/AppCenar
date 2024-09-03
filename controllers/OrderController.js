const Order = require('../models/Order');
const User = require('../models/User');
const Delivery = require('../models/Delivery');
const Commerce = require('../models/Commerce');
const Product = require('../models/Product');

exports.assignOrder = async (req, res, next) => {
    try {
      const userId = req.body.userId;
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }
  
      const deliveries = await Delivery.findAll();
      const randomDelivery = deliveries[Math.floor(Math.random() * deliveries.length)];
      
      const products = await user.getProducts(); 

      const groupedByCommerce = products.reduce((result, product) => {
        result[product.commerceId] = result[product.commerceId] || [];
        result[product.commerceId].push(product);
        return result;
      }, {});
  
      for (const commerceId in groupedByCommerce) {
        const commerceProducts = groupedByCommerce[commerceId];
  
        const order = await Order.create({
          userId: user.id,
          deliveryId: randomDelivery.id,
          commerceId: commerceId,
          products: commerceProducts.map(p => p.id)
        });

        const commerce = await Commerce.findByPk(commerceId);
        await commerce.addOrder(order);

        await user.addOrder(order);
      }
  
      res.redirect('/cart');
    } catch (error) {
      req.flash('errors', 'An error has occurred completing your cart.');
      res.redirect('/cart');
    }
  };