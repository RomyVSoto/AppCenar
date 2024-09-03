const { DataTypes } = require('sequelize');
const sequelize = require('../contexts/AppContext');
const Client = require('./Client');

const Address = sequelize.define('Address', {
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
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

Address.belongsTo(Client);
Client.hasMany(Address);

module.exports = Address;
