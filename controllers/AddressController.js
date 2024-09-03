const Address = require('../models/Address');

exports.getAddresses = async (req, res, next) => {
    try {
        const addresses = await Address.findAll({ where: { ClientId: req.user.id } });
        res.render('appcenar/client/index-address', { 
            pageTitle: 'My Addresses', 
            addresses: addresses, 
            isAuthenticated: req.session.isLoggedIn, 
            user: req.user 
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

exports.getAddAddress = (req, res, next) => {
    res.render('appcenar/client/add-address', { 
        pageTitle: 'Add Address', 
        isAuthenticated: req.session.isLoggedIn, 
        user: req.user 
    });
};

exports.postAddAddress = async (req, res, next) => {
    const { name, description } = req.body;
    try {
        await Address.create({ name, description, ClientId: req.user.id });
        req.flash('success', 'Address added successfully');
        res.redirect('/addresses');
    } catch (err) {
        console.error(err);
        next(err);
    }
};

exports.getEditAddress = async (req, res, next) => {
    const { addressId } = req.params;
    try {
        const address = await Address.findByPk(addressId);
        if (!address) {
            req.flash('errors', 'Address not found');
            return res.redirect('/addresses');
        }
        res.render('appcenar/client/edit-address', { 
            pageTitle: 'Edit Address', 
            address: address, 
            isAuthenticated: req.session.isLoggedIn, 
            user: req.user 
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

exports.postEditAddress = async (req, res, next) => {
    const { addressId, name, description } = req.body;
    try {
        const address = await Address.findByPk(addressId);
        if (!address) {
            req.flash('errors', 'Address not found');
            return res.redirect('/addresses');
        }
        address.name = name;
        address.description = description;
        await address.save();
        req.flash('success', 'Address updated successfully');
        res.redirect('/addresses');
    } catch (err) {
        console.error(err);
        next(err);
    }
};

exports.postDeleteAddress = async (req, res, next) => {
    const { addressId } = req.body;
    try {
        const address = await Address.findByPk(addressId);
        if (!address) {
            req.flash('errors', 'Address not found');
            return res.redirect('/addresses');
        }
        await address.destroy();
        req.flash('success', 'Address deleted successfully');
        res.redirect('/addresses');
    } catch (err) {
        console.error(err);
        next(err);
    }
};
