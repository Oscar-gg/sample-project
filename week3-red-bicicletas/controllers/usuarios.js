const { response } = require('express');
var Usuario = require('../models/usuario');

exports.list = function (req, res) {
    console.log('Antes de call');
    Usuario.find({}).then((usuarios) => {
        res.render('usuarios/index', { usuarios: usuarios });
    });
}

exports.create_get = function (req, res) {
    res.render('usuarios/create', { errors: {}, usuario: new Usuario() });
}

exports.create = function (req, res) {
    if (req.body.password != req.body.confirm_password) {
        console.log("Passwords no son iguales");
        res.render('usuarios/create', {
            errors: { confirm_password: { message: 'No coinciden los passwords' } },
            usuario: new Usuario({ nombre: req.body.nombre, email: req.body.email })
        });
        return;
    }

    const newUser = new Usuario({ nombre: req.body.nombre, email: req.body.email, password: req.body.password });

    Usuario.create(newUser).then((usuario) => {
        if (usuario.verificado) {
            console.log("Usuario verificado");
            res.render('usuarios/create', { errors: { confirm_password: { message: "Ya existe un usario con ese correo" } }, usuario: new Usuario({ nombre: req.body.nombre, email: req.body.email }) });
        } else {
            usuario.enviar_email_bienvenida();
            res.redirect('/usuarios');
        }
    }).catch((err) => {
        console.log(err);
        res.render('usuarios/create', { errors: err.errors, usuario: new Usuario({ nombre: req.body.nombre, email: req.body.email }) })
    });
}

exports.update_get = function (req, res) {
    Usuario.findById(req.params.id).then((usuario) => {
        res.render('usuarios/update', { errors: {}, usuario: usuario });
    }).catch((err) => {
        console.log(err);
        res.render('usuarios/index');
    });
}

exports.update = function (req, res) {
    var update_values = { nombre: req.body.nombre };
    Usuario.findByIdAndUpdate(req.params.id, update_values).then(() => {
        res.redirect('/usuarios');
        return;
    }).catch((err) => {
        console.log(err);
        res.render('usuarios/update', { usuario: new Usuario({ nombre: req.body.nombre, email: req.body.email }) });
    });
}

exports.delete = function (req, res, next) {
    Usuario.findByIdAndDelete(req.params.id).then(() => {
        res.redirect('/usuarios');
    }).catch((err) => {
        console.log('Hubo un error: ');
        console.log(err);
        next();
    });
}
