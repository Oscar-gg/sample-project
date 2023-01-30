var Bicicleta = require("../../models/bicicleta");
const { bicicleta_list } = require("../bicicleta");

exports.bicicleta_list = function(req, res){
    Bicicleta.find({}, function(err, bicicletas){
        res.status(200).json({
            bicicletas: bicicletas
        });
    });
}

exports.bicicleta_create = function(req, res){
    var bici = new Bicicleta(req.body.id, req.body.color, req.body.modelo);
    bici.ubicacion = [req.body.lat, req.body.lng]

    bici.add();

    res.status(200).json({
        bicicleta: bici
    });
}

exports.bicicleta_delete = function(req, res){
    var bici = Bicicleta.findById(req.body.id);
    Bicicleta.remove(req.body.id);
    
    // Ver bicicleta borrada
    res.status(200).json({
        bicicleta: bici
    });
}