const { DataTypes } = require('sequelize');
const sequelize = require('../contexts/AppContext');

const Category = sequelize.define('Category', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  }
});


module.exports = Category;
