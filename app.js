port = 5000;

const express = require('express');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const app = express();
const connection = require('./contexts/AppContext');

const User = require('./models/User');

require('./models/Associations');
const errorController = require('./controllers/ErrorController');

app.engine(
  'hbs',
  engine({
    layoutsDir: 'views/layouts/',
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: {
      eq: function (arg1, arg2) {
        return arg1 == arg2;
      }
    },
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    }
  })
);

app.set('view engine', 'hbs');
app.set('views', 'views');

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  session({ secret: 'anything', resave: true, saveUninitialized: false })
);

app.use(flash());

app.use((req, res, next) => {
  if (!req.session) {
    return next();
  }
  if (!req.session.user) {
    return next();
  }
  User.findByPk(req.session.user.id)
    .then((user) => {
      req.user = user;
      res.locals.user = user;
      res.locals.isAuthenticated = req.session.isLoggedIn;
      res.locals.userRole = user.role;
      next();
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

app.use((req, res, next) => {
  res.locals.errorMessages = req.flash('errors');
  res.locals.hasErrorMessages = res.locals.errorMessages.length > 0;
  res.locals.successMessages = req.flash('success');
  res.locals.hasSuccessMessages = res.locals.successMessages.length > 0;
  res.locals.infoMessages = req.flash('info');
  res.locals.hasInfoMessages = res.locals.infoMessages.length > 0;
  res.locals.warningMessages = req.flash('warning');
  res.locals.hasWarningMessages = res.locals.warningMessages.length > 0;
  next();
});

const authRouter = require('./routes/Auth');
const adminRouter = require('./routes/Admin');
const appCenarRouter = require('./routes/AppCenar');
const commerceRouter = require('./routes/Commerce');
const addressRouter = require('./routes/Address');
const cartRouter = require('./routes/Cart');


app.use(authRouter);
app.use(adminRouter);
app.use(appCenarRouter);
app.use(commerceRouter);
app.use(addressRouter);
app.use(cartRouter);



app.get('/', (req, res, next) => {
  res.redirect('/login');
});

app.use(errorController.Get404);

connection.sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Servidor iniciado en el puerto: ${port}`);
    });
  })
  .catch(err => {
    console.error('Error al iniciar el servidor:', err);
  });
