var Bicicleta = require("../../models/bicicleta");
const { bicicleta_list } = require("../bicicleta");

exports.bicicleta_list = function (req, res) {
    Bicicleta.find({}).then((bicis) => {
        res.status(200).json({
            bicicletas: bicis
        });
    });
}

exports.bicicleta_create = function (req, res) {
    var bici = Bicicleta.createInstance(req.body.id, req.body.color, req.body.modelo, [req.body.lat, req.body.lng]);
    Bicicleta.add(bici);

    res.status(200).json({
        bicicleta: bici
    });
}

exports.bicicleta_delete = async function (req, res) {
    var bici = await Bicicleta.findByCode(req.body.id);
    await Bicicleta.removeByCode(req.body.id);
    // console.log(bici);
    // Ver bicicleta borrada
    res.status(200).json({
        bicicleta: bici
    });
}