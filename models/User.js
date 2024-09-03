const { DataTypes } = require('sequelize');
const sequelize = require('../contexts/AppContext');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false
  },
  picture: {
    type: DataTypes.STRING,
    allowNull: true
  },
  resetToken: DataTypes.STRING,
  resetTokenExpiration: DataTypes.DATE,
});

module.exports = User;
