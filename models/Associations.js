const User = require('./User');
const Client = require('./Client');
const Commerce = require('./Commerce');
const Delivery = require('./Delivery');
const Category = require('./Category');
const Product = require('./Product');
const Address = require('./Address');

User.hasOne(Client);
Client.belongsTo(User);

User.hasOne(Commerce);
Commerce.belongsTo(User);

User.hasOne(Delivery);
Delivery.belongsTo(User);

Category.hasMany(Product);
Product.belongsTo(Category);

Commerce.hasMany(Product, { foreignKey: 'commerceId', as: 'products' });
Product.belongsTo(Commerce, { foreignKey: 'commerceId' });

Client.hasMany(Address);
Address.belongsTo(Client);

Product.belongsToMany(User, { through: 'UserProducts' });
User.belongsToMany(Product, { through: 'UserProducts' });

module.exports = {
    User,
    Client,
    Commerce,
    Delivery,
    Category,
    Product,
    Address,
};
