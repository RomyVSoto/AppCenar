const { DataTypes } = require('sequelize');
const sequelize = require('../contexts/AppContext');
const Category = require('./Category');

const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  categoryId: {
    type: DataTypes.INTEGER,
    references: {
      model: Category,
      key: 'id'
    }
  }
});

Product.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports = Product;
