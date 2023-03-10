var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('./config/passport');
const session = require('express-session');
const jwt = require('jsonwebtoken');

var indexRouter = require('./routes/index');
var biciRouter = require('./routes/bicicletas');
var biciApiRouter = require('./routes/api/bicicletas');
var usuariosAPIRouter = require('./routes/api/usuarios');
var tokenRouter = require('./routes/token');
var usuariosRouter = require('./routes/usuarios');
var authAPIRouter = require('./routes/api/auth');

const store = new session.MemoryStore;

var app = express();

app.set('secretKey', 'jwt_pwd_!!223344');

app.use(session({
  cookie: { maxAge: 240 * 60 * 60 * 1000 },
  store: store,
  saveUninitialized: true,
  resave: 'true',
  secret: 'red_bicicsfwfewt45!22212'
}));

var mongoose = require('mongoose');
const Usuario = require('./models/usuario');
const Token = require('./models/token');

var mongoDB = "mongodb://127.0.0.1/red_bicicletas";
mongoose.connect(mongoDB);
var db = mongoose.connection;
db.on('error', console.log.bind(console, "MongoDB connection error: "));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/login', function (req, res) {
  res.render('session/login');
});

app.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, usuario, info) {
    if (err) return next(err);

    if (!usuario) {
      return res.render('session/login', { info });
    }

    req.logIn(usuario, function (err) {
      if (err) return next(err);
      return res.redirect('/');
    });
  })(req, res, next);
});

app.get('/logout', function (req, res) {
  req.logOut();
  res.redirect('/');
});

app.get('/forgotPassword', function (req, res) {
  res.render('session/forgotPassword');
});

app.post('/forgotPassword', function (req, res) {
  Usuario.findOne({ email: req.body.email }, function (err, usuario) {
    if (!usuario) return res.render('session/forgotPassword', { info: { message: "No existe un usuario con ese correo." } });

    usuario.resetPassword(function (err) {
      if (err) return next(err);
      console.log('session/forgotPasswordMessage');
    });

    res.render('session/forgotPasswordMessage');
  });
});

app.get('/resetPassword/:token', function (req, res, next) {
  Token.findOne({ token: req.params.token }, function (err, token) {
    if (!token) return res.status(400).send({ type: 'not-verified', msg: 'No existe este token, ha expirado, o ya fue usado' });

    Usuario.findById(token._userid, function (err, usuario) {
      if (!usuario) return res.status(400).send({ msg: 'No existe un usuario asociado con ese token.' });
      res.render('session/resetPassword', { errors: {}, token: token });
    });
  });
});

app.post('/resetPassword/', function (req, res) {
  Token.findOne({ token: req.body.token }, function (err, token) {
    if (!token) return res.status(400).send({ type: 'not-verified', msg: 'No existe este token, ha expirado, o ya fue usado' });

    Usuario.findById(token._userid, function (err, usuario) {
      if (!usuario) return res.status(400).send({ msg: 'No existe un usuario asociado con ese token.' });
      if (req.body.password != req.body.confirm_password) {
        res.render('session/resetPassword', { errors: { confirm_password: { message: 'No coinciden los passwords' } }, token: token });
        return;
      }

      usuario.password = req.body.password;
      usuario.save(function (err) {
        if (err) {
          res.render('session/resetPassword', { errors: err.errors, token: token })
        } else {
          // Borrar tokens que ya no son necesarios.
          Token.deleteTokens(usuario._id);
          res.redirect('/login');
        }
      });
    });
  });
});

app.use('/', indexRouter);
app.use('/usuarios', usuariosRouter);
app.use('/token', tokenRouter);

app.use('/bicicletas', loggedIn, biciRouter);
app.use('/api/auth', authAPIRouter);
app.use('/api/bicicletas', validarUsuario, biciApiRouter);
app.use('/api/usuarios', usuariosAPIRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function loggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    console.log('Usuario sin loguearse');
    res.redirect('/login');
  }
}

function validarUsuario(req, res, next) {
  jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function (err, decoded) {
    if (err) {
      res.json({ status: 'error', message: err.message, data: null });
    } else {
      req.body.userId = decoded.id;
      console.log('jwt verify: ' + decoded);
      next();
    }
  });
}

module.exports = app;
