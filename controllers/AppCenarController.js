const Commerce = require('../models/Commerce');

exports.getMainPage = async (req, res, next) => {
  try {
    if (req.session.isLoggedIn) {
      const comercios = await Commerce.findAll();
      res.render('index', { 
        pageTitle: 'Main Page', 
        comercios: comercios,
        isAuthenticated: req.session.isLoggedIn,
        user: req.user,
      });
    } else {
      res.redirect('/login');
    }
  } catch (err) {
    console.log(err);
    res.redirect('/login');
  }
};