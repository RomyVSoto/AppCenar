const Client = require("../models/Client");
const User = require("../models/User");
const Delivery = require("../models/Delivery");
const Commerce = require("../models/Commerce");

exports.getList = async (req, res, next) => {
  try {
    const clients = await Client.findAll({ include: User });
    const deliveries = await Delivery.findAll({ include: User });
    const commerces = await Commerce.findAll({ include: User });
    res.render("admin/admin-panel", {
      pageTitle: "Admin Panel",
      clients: clients,
      deliveries: deliveries,
      commerces: commerces,
      hasClients: clients.length > 0,
      hasDeliveries: deliveries.length > 0,
      hasCommerces: commerces.length > 0,
    });
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
};

exports.getUserById = async (req, res, next) => {
  const UserId = req.params.UserId;
  try {
    const user = await User.findByPk(UserId);
    if (!user) {
      req.flash("errors", "User not found.");
      return res.redirect("/admin");
    }
    res.render("admin/edit-user", {
      pageTitle: "Edit User",
      user: user,
      isAuthenticated: req.session.isLoggedIn,
      userRole: req.user.role
    });
  } catch (err) {
    console.error(err);
    req.flash("errors", "An error occurred. Please try again later.");
    res.redirect("/admin");
  }
};

exports.postEditUser = async (req, res, next) => {
  const { UserId, username, email, firstName, lastName, phone, role } = req.body;
  const picture = req.file ? `/uploads/images/${req.file.filename}` : null;

  try {
    const user = await User.findByPk(UserId);
    if (!user) {
      req.flash("errors", "User not found.");
      return res.redirect("/admin");
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.role = role || user.role;
    if (picture) user.picture = picture;
    await user.save();

    if (role === 'client') {
      const client = await Client.findOne({ where: { UserId: user.id } });
      if (client) {
        client.firstName = firstName || client.firstName;
        client.lastName = lastName || client.lastName;
        client.phone = phone || client.phone;
        if (picture) client.picture = picture;
        await client.save();
      }
    } else if (role === 'commerce') {
      const commerce = await Commerce.findOne({ where: { UserId: user.id } });
      if (commerce) {
        commerce.name = username || commerce.name;
        commerce.phone = phone || commerce.phone;
        if (picture) commerce.picture = picture;
        await commerce.save();
      }
    } else if (role === 'delivery') {
      const delivery = await Delivery.findOne({ where: { UserId: user.id } });
      if (delivery) {
        delivery.firstName = firstName || delivery.firstName;
        delivery.lastName = lastName || delivery.lastName;
        delivery.phone = phone || delivery.phone;
        if (picture) delivery.picture = picture;
        await delivery.save();
      }
    }

    req.flash("success", "User updated successfully.");
    res.redirect("/admin");
  } catch (err) {
    console.error(err);
    req.flash("errors", "An error occurred. Please try again later.");
    res.redirect("/admin");
  }
};


exports.postDeleteUser = async (req, res, next) => {
  const { clientId } = req.body;

  try {
    const client = await Client.findByPk(clientId);
    const userId = client.UserId;
    await client.destroy();
    await User.destroy({ where: { id: userId } });

    req.flash("success", "Client deleted successfully.");
    res.redirect("/admin");
  } catch (err) {
    console.error(err);
    req.flash("errors", "An error occurred. Please try again later.");
    res.redirect("/admin");
  }
};

exports.getCommerceById = async (req, res, next) => {
  const commerceId = req.params.commerceId;
  try {
    const commerce = await Commerce.findByPk(commerceId, { include: User });
    if (!commerce) {
      req.flash("errors", "Commerce not found.");
      return res.redirect("/admin");
    }
    res.render("admin/edit-commerce", {
      pageTitle: "Edit Commerce",
      commerce: commerce,
      user: commerce.User,
      isAuthenticated: req.session.isLoggedIn,
      userRole: req.user.role
    });
  } catch (err) {
    console.error(err);
    req.flash("errors", "An error occurred. Please try again later.");
    res.redirect("/admin");
  }
};

exports.postEditCommerce = async (req, res, next) => {
  const { commerceId, username, email, name, phone, openingHour, closingHour } = req.body;
  const picture = req.file ? `/uploads/images/${req.file.filename}` : null;

  try {
    const commerce = await Commerce.findByPk(commerceId);
    const user = await User.findByPk(commerce.UserId);

    user.username = username;
    user.email = email;
    if (picture) user.picture = picture;
    await user.save();

    commerce.name = name;
    commerce.phone = phone;
    commerce.openingHour = openingHour;
    commerce.closingHour = closingHour;
    if (picture) commerce.picture = picture;
    await commerce.save();

    req.flash("success", "Commerce updated successfully.");
    res.redirect("/admin");
  } catch (err) {
    console.error(err);
    req.flash("errors", "An error occurred. Please try again later.");
    res.redirect("/admin");
  }
};

exports.postDeleteCommerce = async (req, res, next) => {
  const { commerceId } = req.body;

  try {
    const commerce = await Commerce.findByPk(commerceId);
    const userId = commerce.UserId;
    await commerce.destroy();
    await User.destroy({ where: { id: userId } });

    req.flash("success", "Commerce deleted successfully.");
    res.redirect("/admin");
  } catch (err) {
    console.error(err);
    req.flash("errors", "An error occurred. Please try again later.");
    res.redirect("/admin");
  }
};

exports.getDeliveryById = async (req, res, next) => {
  const deliveryId = req.params.deliveryId;
  try {
    const delivery = await Delivery.findByPk(deliveryId, { include: User });
    if (!delivery) {
      req.flash("errors", "Delivery not found.");
      return res.redirect("/admin");
    }
    res.render("admin/edit-delivery", {
      pageTitle: "Edit Delivery",
      delivery: delivery,
      user: delivery.User, 
      isAuthenticated: req.session.isLoggedIn,
      userRole: req.user.role
    });
  } catch (err) {
    console.error(err);
    req.flash("errors", "An error occurred. Please try again later.");
    res.redirect("/admin");
  }
};

exports.postEditDelivery = async (req, res, next) => {
  const { deliveryId, username, email, firstName, lastName, phone } = req.body;
  const picture = req.file ? `/uploads/images/${req.file.filename}` : null;

  try {
    const delivery = await Delivery.findByPk(deliveryId);
    const user = await User.findByPk(delivery.UserId);

    user.username = username;
    user.email = email;
    if (picture) user.picture = picture;
    await user.save();

    delivery.firstName = firstName;
    delivery.lastName = lastName;
    delivery.phone = phone;
    if (picture) delivery.picture = picture;
    await delivery.save();

    req.flash("success", "Delivery updated successfully.");
    res.redirect("/admin");
  } catch (err) {
    console.error(err);
    req.flash("errors", "An error occurred. Please try again later.");
    res.redirect("/admin");
  }
};

exports.postDeleteDelivery = async (req, res, next) => {
  const { deliveryId } = req.body;

  try {
    const delivery = await Delivery.findByPk(deliveryId);
    const userId = delivery.UserId;
    await delivery.destroy();
    await User.destroy({ where: { id: userId } });

    req.flash("success", "Delivery deleted successfully.");
    res.redirect("/admin");
  } catch (err) {
    console.error(err);
    req.flash("errors", "An error occurred. Please try again later.");
    res.redirect("/admin");
  }
};
