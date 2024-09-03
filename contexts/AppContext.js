const Sequelize = require("sequelize");

const connection = new Sequelize('AppCenar', 'Romy', '', {
  host: 'localhost',
  dialect: 'mysql',
  dialectOptions: {
    timezone: 'America/Santo_Domingo',
  },
  timezone: '-04:00',
});

connection.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = connection;
