const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: false,
    port: 587,
    auth: {
        user: "romyvs01@gmail.com",
        pass: "dbcfpmglemnddtcz",
    },
    tls: {
        rejectUnauthorized: false
    }
});

module.exports = transporter;