const { response } = require('express');
var Usuario = require('../models/usuario');

exports.list = function (req, res) {
    Usuario.find({}).then((usuarios) => {
        res.render('usuarios/index', { usuarios: usuarios });
    });
}

exports.create_get = function (req, res) {
    res.render('usuarios/create', { errors: {}, usuario: new Usuario() });
}

exports.create = function (req, res) {
    if (req.body.password != req.body.confirm_password) {
        res.render('usuarios/create', {
            errors: { confirm_password: { message: 'No coinciden los passwords' } },
            usuario: new Usuario({ nombre: req.body.nombre, email: req.body.email })
        });
        return;
    }

    Usuario.create({ nombre: req.body.nombre, email: req.body.email, password: req.body.password }).then((err, nuevoUsuario) => {
        if (err) {
            res.render('usuarios/create', { errors: err.errors, usuario: new Usuario({ nombre: req.body.nombre, email: req.body.email }) });
        } else {
            nuevoUsuario.enviar_email_bienvenida();
            res.redirecr('/usuarios');
        }
    });
}

exports.update_get = function (req, res) {
    Usuario.findById(req.params.id).then((err, usuario) => {
        res.render('usuarios/update', { errors: {}, usuario: usuario });
    });
}

exports.update = function (req, res) {
    var update_values = { nombre: req.body.nombre };
    Usuario.findByIdAndUpdate(req.params.id, update_values).then((err, usuario) => {
        if (err) {
            console.log(err);
            res.render('usuarios/update', { errors: err.errors, usuario: new Usuario({ nombre: req.body.nombre, email: req.body.email }) });
        } else {
            res.redirect('/usuario')
            return;
        }
    });

    Usuario.findById(req.params.id).then((err, usuario) => {
        res.render('usuarios/update', { errors: {}, usuario: usuario });
    });
}

exports.delete = function (req, res, next) {
    Usuario.findByIdAndDelete(req.body.id).then((err) => {
        if (err)
            next(err);
        else
            res.redirect('/usuarios');
    });
}
