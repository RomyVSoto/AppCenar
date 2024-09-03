const { DataTypes } = require('sequelize');
const sequelize = require('../contexts/AppContext');
const Product = require('../models/Product');

const Commerce = sequelize.define('Commerce', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    picture: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    openingHour: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    closingHour: {
        type: DataTypes.TIME,
        allowNull: false,
    },
});

Commerce.hasMany(Product, { foreignKey: 'commerceId' });

module.exports = Commerce;
