const { v4: uuidv4 } = require('uuid');
const bcrypt = require("bcryptjs");
const { Sequelize } = require('sequelize');
const transporter = require("../services/EmailService");

const User = require("../models/User");
const Client = require("../models/Client");
const Commerce = require("../models/Commerce");
const Delivery = require("../models/Delivery");


exports.GetLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    layout: "auth",
    loginCSS: true,
    loginActive: true,
  });
};

exports.PostLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ where: { email: email } })
    .then((user) => {
      if (!user) {
        req.flash("errors", "Email is invalid");
        return res.redirect("/login");
      }

      bcrypt
        .compare(password, user.password)
        .then((result) => {
          if (result) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/main");
            });
          }
          req.flash("errors", "Password is invalid");
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
          req.flash("errors", "An error has occurred, contact the administrator.");
          res.redirect("/login");
        });
    })
    .catch((err) => {
      console.log(err);
      req.flash("errors", "An error has occurred, contact the administrator.");
      res.redirect("/login");
    });
};

exports.Logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/login");
  });
};

exports.GetSignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Signup",
    layout: "auth",
    signupActive: true,
  });
};

exports.PostSignup = async (req, res, next) => {
  const { username, email, password, confirmPassword, firstName, lastName, phone } = req.body;
  const picture = req.file ? `/uploads/images/${req.file.filename}` : `/assets/img/default-logo.jpg`;

  if (password !== confirmPassword) {
    req.flash("errors", "Passwords do not match");
    return res.redirect("/signup");
  }

  if (!firstName || !lastName || !email || !phone || !picture) {
    req.flash("errors", "All fields are required");
    return res.redirect("/signup");
  }

  try {
    let user = await User.findOne({ where: { email } });

    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 12);

      user = await User.create({
        username,
        email,
        password: hashedPassword,
        role: 'client',
        picture: picture
      });
    }

    let client = await Client.findOne({ where: { email } });

    if (!client) {
      client = await Client.create({
        firstName,
        lastName,
        email,
        phone,
        picture,
        UserId: user.id
      });
    } else {
      client.UserId = user.id;
      await client.save();
    }

    req.flash("success", "You have successfully registered. Please log in.");
    res.redirect("/login");
  } catch (err) {
    console.log(err);
    req.flash("errors", "An error occurred. Please try again later.");
    res.redirect("/signup");
  }
};

exports.GetSignupCommerce = (req, res, next) => {
  res.render("auth/signup-commerce", {
    pageTitle: "Commerce Register",
    signupActive: true,
  });
};

exports.PostSignupCommerce = async (req, res, next) => {
  const { name, email, password, confirmPassword, phone, openingHour, closingHour } = req.body;
  const picture = req.file ? `/uploads/images/${req.file.filename}` : `/assets/img/no-image.jpg`;

  if (password !== confirmPassword) {
    req.flash("errors", "Passwords do not match.");
    return res.redirect("/signup-commerce");
  }

  try {
    let user = await User.findOne({ where: { email } });

    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 12);

      user = await User.create({
        username: name,
        email,
        password: hashedPassword,
        role: 'commerce',
        picture: picture
      });
    }

    let commerce = await Commerce.findOne({ where: { email } });

    if (!commerce) {
      commerce = await Commerce.create({
        name,
        phone,
        email,
        openingHour,
        closingHour,
        picture,
        UserId: user.id
      });
    } else {
      commerce.UserId = user.id;
      await commerce.save();
    }

    req.flash("success", "Commerce registered successfully. Please, log in.");
    res.redirect("/login");
  } catch (err) {
    console.error('Error durante el registro de comercio:', err);
    req.flash("errors", "An error has occurred. Please, try again.");
    res.redirect("/signup-commerce");
  }
};

exports.GetSignupDelivery = (req, res, next) => {
  res.render("auth/signup-delivery", {
    pageTitle: "Delivery Register",
    signupActive: true,
  });
};

exports.PostSignupDelivery = async (req, res, next) => {
  const { firstName, lastName, email, password, confirmPassword, phone } = req.body;
  const picture = req.file ? `/uploads/images/${req.file.filename}` : `/assets/img/no-image.jpg`;

  if (!firstName || !lastName || !email || !password || !confirmPassword || !phone) {
    req.flash("errors", "All fields are required.");
    return res.redirect("/signup-delivery");
  }

  if (password !== confirmPassword) {
    req.flash("errors", "Passwords do not match.");
    return res.redirect("/signup-delivery");
  }

  try {
    let user = await User.findOne({ where: { email } });

    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 12);

      user = await User.create({
        username: firstName,
        email,
        password: hashedPassword,
        role: 'delivery',
        picture: picture
      });
    }

    let delivery = await Delivery.findOne({ where: { email } });

    if (!delivery) {
      delivery = await Delivery.create({
        firstName,
        lastName,
        phone,
        email,
        picture,
        UserId: user.id
      });
    } else {
      delivery.UserId = user.id;
      await delivery.save();
    }

    req.flash("success", "Delivery registered successfully. Please log in.");
    res.redirect("/login");
  } catch (err) {
    console.error('Error during delivery registration:', err);
    req.flash("errors", "An error occurred. Please try again..");
    res.redirect("/signup-delivery");
  }
};

exports.postForgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      req.flash('errors', 'No account with that email found.');
      return res.redirect('/forgot-password');
    }

    const token = uuidv4();
    const expirationTime = new Date(Date.now() + 3600000);
    console.log('Generated token:', token);
    console.log('Expiration time:', expirationTime);

    user.resetToken = token;
    user.resetTokenExpiration = expirationTime;
    await user.save();

    await transporter.sendMail({
      to: email,
      from: 'your-email@gmail.com',
      subject: 'Password Reset',
      html: `
        <p>You requested a password reset</p>
        <p>Click this <a href="http://${req.headers.host}/reset-password/${token}">link</a> to set a new password.</p>
      `
    });

    req.flash('info', 'Check your email for a password reset link.');
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.getResetPassword = async (req, res, next) => {
  const { token } = req.params;
  try {
    const user = await User.findOne({ where: { resetToken: token, resetTokenExpiration: { [Sequelize.Op.gt]: Date.now() } } });
    if (!user) {
      req.flash('errors', 'Token is invalid or has expired.');
      return res.redirect('/forgot-password');
    }
    res.render('auth/reset-password', {
      pageTitle: 'Reset Password',
      userId: user.id.toString(),
      passwordToken: token
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.postResetPassword = async (req, res, next) => {
  const { password, confirmPassword, userId, passwordToken } = req.body;
  if (password !== confirmPassword) {
    req.flash('errors', 'Passwords do not match.');
    return res.redirect('back');
  }
  try {
    const user = await User.findOne({
      where: {
        resetToken: passwordToken,
        resetTokenExpiration: { [Sequelize.Op.gt]: Date.now() },
        id: userId
      }
    });
    if (!user) {
      req.flash('errors', 'Token is invalid or has expired.');
      return res.redirect('/forgot-password');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiration = null;
    await user.save();

    req.flash('success', 'Password has been reset successfully.');
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    next(err);
  }
};