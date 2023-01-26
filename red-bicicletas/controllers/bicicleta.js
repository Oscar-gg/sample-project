var Bicicleta = require("../models/bicicleta");

exports.bicicleta_list = function (req, res){
    res.render("bicicletas/index", {bicis: Bicicleta.allBicis});
}

exports.bicicleta_create_get = function (req, res){
    res.render("bicicletas/create");
}

exports.bicicleta_create_post = function(req, res){
    var biciN = new Bicicleta(req.body.id, req.body.color, req.body.modelo);
    biciN.ubicacion = [req.body.lat, req.body.lng];
    biciN.add();
    res.redirect('/bicicletas');
}

exports.bicicleta_delete_post = function(req, res){
    Bicicleta.remove(req.params.id);
    res.redirect('/bicicletas');
}

exports.bicicleta_update_get = function(req, res){
    var biciT = Bicicleta.findById(req.params.id);
    res.render('bicicletas/update', {bici: biciT});
}

exports.bicicleta_update_post = function(req, res){
    var biciT = Bicicleta.findById(req.params.id);
    biciT.id = req.body.id;
    biciT.color = req.body.color;
    biciT.modelo = req.body.modelo;
    biciT.ubicacion = [req.body.lat, req.body.lng];
    
    res.redirect('/bicicletas');
}