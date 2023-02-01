var Bicicleta = require("../models/bicicleta");

exports.bicicleta_list = async function (req, res) {
    bicis = await Bicicleta.allBicis();
    res.render("bicicletas/index", { bicis: bicis });
}

exports.bicicleta_create_get = function (req, res) {
    res.render("bicicletas/create");
}

exports.bicicleta_create_post = function (req, res) {
    var biciN = Bicicleta.createInstance(req.body.id, req.body.color, req.body.modelo, [req.body.lng, req.body.lat]);
    Bicicleta.add(biciN);
    res.redirect('/bicicletas');
}

exports.bicicleta_delete_post = async function (req, res) {
    console.log(req.params.id);
    await Bicicleta.removeByCode(req.params.id);
    res.redirect('/bicicletas');
}

exports.bicicleta_update_get = async function (req, res) {
    var biciT = await Bicicleta.findByCode(req.params.id);
    res.render('bicicletas/update', { bici: biciT });
}

exports.bicicleta_update_post = async function (req, res) {
    await Bicicleta.findOneAndUpdate({ code: req.params.id }, { code: req.body.code,
        modelo: req.body.modelo, color: req.body.color, ubicacion: [req.body.lat, req.body.lng]
    });

    res.redirect('/bicicletas');
}