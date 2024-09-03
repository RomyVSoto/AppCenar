const Client = require('../models/Client');
const User = require('../models/User');
const Delivery = require('../models/Delivery');
const Commerce = require('../models/Commerce');

exports.getProfile = async (req, res, next) => {
  const userId = req.user.id;
  const role = req.user.role;

  try {
    let profileData = null;
    let pageTitle = "Profile";

    if (role === 'client') {
      profileData = await Client.findOne({ where: { UserId: userId }, include: User });
      if (!profileData) {
        req.flash("errors", "Client not found.");
        return res.redirect("/main");
      }
      pageTitle = "Profile";
    } else if (role === 'commerce') {
      profileData = await Commerce.findOne({ where: { UserId: userId }, include: User });
      if (!profileData) {
        req.flash("errors", "Commerce not found.");
        return res.redirect("/main");
      }
      pageTitle = "Profile";
    } else if (role === 'delivery') {
      profileData = await Delivery.findOne({ where: { UserId: userId }, include: User });
      if (!profileData) {
        req.flash("errors", "Delivery not found.");
        return res.redirect("/main");
      }
      pageTitle = "Profile";
    } else {
      req.flash("errors", "Invalid role.");
      return res.redirect("/main");
    }

    res.render("appcenar/profile", {
      pageTitle: pageTitle,
      profileData: profileData,
      user: profileData.User,
      isAuthenticated: req.session.isLoggedIn,
      userRole: req.user.role
    });
  } catch (err) {
    console.error(err);
    req.flash("errors", "An error occurred. Please try again later.");
    res.redirect("/main");
  }
};

exports.getEditProfile = async (req, res, next) => {
  const userId = req.user.id;
  const role = req.user.role;

  try {
    let profileData = null;
    let pageTitle = "Edit Profile";

    if (role === 'client') {
      profileData = await Client.findOne({ where: { UserId: userId }, include: User });
      if (!profileData) {
        req.flash("errors", "Client not found.");
        return res.redirect("/main");
      }
      pageTitle = "Edit Client Profile";
      res.render("appcenar/client/edit-profile", {
        pageTitle: pageTitle,
        profileData: profileData,
        user: profileData.User,
        isAuthenticated: req.session.isLoggedIn,
        userRole: req.user.role
      });
    } else if (role === 'commerce') {
      profileData = await Commerce.findOne({ where: { UserId: userId }, include: User });
      if (!profileData) {
        req.flash("errors", "Commerce not found.");
        return res.redirect("/main");
      }
      pageTitle = "Edit Commerce Profile";
      res.render("appcenar/commerce/edit-profile", {
        pageTitle: pageTitle,
        profileData: profileData,
        user: profileData.User,
        isAuthenticated: req.session.isLoggedIn,
        userRole: req.user.role
      });
    } else if (role === 'delivery') {
      profileData = await Delivery.findOne({ where: { UserId: userId }, include: User });
      if (!profileData) {
        req.flash("errors", "Delivery not found.");
        return res.redirect("/main");
      }
      pageTitle = "Edit Delivery Profile";
      res.render("appcenar/delivery/edit-profile", {
        pageTitle: pageTitle,
        profileData: profileData,
        user: profileData.User,
        isAuthenticated: req.session.isLoggedIn,
        userRole: req.user.role
      });
    } else {
      req.flash("errors", "Invalid role.");
      return res.redirect("/main");
    }
  } catch (err) {
    console.error(err);
    req.flash("errors", "An error occurred. Please try again later.");
    res.redirect("/main");
  }
};

exports.postEditProfile = async (req, res, next) => {
  const { firstName, lastName, phone, name, openingHour, closingHour } = req.body;
  const userId = req.user.id;
  const role = req.user.role;
  const picture = req.file ? `/uploads/images/${req.file.filename}` : null;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      req.flash("errors", "User not found.");
      return res.redirect("/profile");
    }

    if (req.body.username) user.username = req.body.username;
    if (req.body.email) user.email = req.body.email;
    if (picture) user.picture = picture;
    await user.save();

    if (role === 'client') {
      const client = await Client.findOne({ where: { UserId: userId } });
      if (client) {
        if (firstName) client.firstName = firstName;
        if (lastName) client.lastName = lastName;
        if (phone) client.phone = phone;
        if (picture) client.picture = picture;
        await client.save();
      }
    } else if (role === 'commerce') {
      const commerce = await Commerce.findOne({ where: { UserId: userId } });
      if (commerce) {
        if (name) commerce.name = name;
        if (phone) commerce.phone = phone;
        if (openingHour) commerce.openingHour = openingHour;
        if (closingHour) commerce.closingHour = closingHour;
        if (picture) commerce.picture = picture;
        await commerce.save();
      }
    } else if (role === 'delivery') {
      const delivery = await Delivery.findOne({ where: { UserId: userId } });
      if (delivery) {
        if (firstName) delivery.firstName = firstName;
        if (lastName) delivery.lastName = lastName;
        if (phone) delivery.phone = phone;
        if (picture) delivery.picture = picture;
        await delivery.save();
      }
    } else {
      req.flash("errors", "Invalid role.");
      return res.redirect("/profile");
    }

    req.flash("success", "Profile updated successfully.");
    res.redirect("/profile");
  } catch (err) {
    console.error(err);
    req.flash("errors", "An error occurred. Please try again later.");
    res.redirect("/profile");
  }
};