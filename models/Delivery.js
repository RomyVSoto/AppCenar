const { DataTypes } = require('sequelize');
const sequelize = require('../contexts/AppContext');

const Delivery = sequelize.define('Delivery', {
  id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
  },
  firstName: {
      type: DataTypes.STRING,
      allowNull: false,
  },
  lastName: {
      type: DataTypes.STRING,
      allowNull: false,
  },
  email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, 
  },
  phone: {
      type: DataTypes.STRING,
      allowNull: false,
  },
  picture: {
      type: DataTypes.STRING,
      allowNull: true,
  },
});

module.exports = Delivery;
