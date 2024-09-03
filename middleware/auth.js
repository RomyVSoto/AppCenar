module.exports = (req, res, next) => {
    console.log("Session: ", req.session);
    if (!req.session.isLoggedIn) {
        req.flash("errors", "You are not authorized to access this section");
        return res.redirect("/");
    }
    next();
};
