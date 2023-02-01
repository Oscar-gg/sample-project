var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bicicletaSchema = new Schema({
    code: Number,
    color: String,
    modelo: String,
    ubicacion: {
        type: [Number], index: { type: "2dsphere", sparse: true }
    }
});

bicicletaSchema.statics.createInstance = function(code, color, modelo, ubicacion){
    return new this({
        code: code,
        color: color,
        modelo: modelo,
        ubicacion: ubicacion
    });
};

bicicletaSchema.methods.toString = function () {
    return `code: ${this.code} | color: ${this.color}`
};

bicicletaSchema.statics.allBicis = function(){
    return this.find({});
};

bicicletaSchema.statics.add = function(bici){
    return this.create(bici);
};

bicicletaSchema.statics.findByCode = function(code){
    return this.findOne({code: code});
};

bicicletaSchema.statics.removeByCode = function(code){
    return this.deleteOne({code: code});
};

bicicletaSchema.statics.deleteAll = function(){
    return this.deleteMany({});
}

module.exports = mongoose.model("Bicicleta", bicicletaSchema);

/*
var Bicicleta = function (id, color, modelo, ubicacion){
    this.id = id;
    this.color = color;
    this.modelo = modelo;
    this.ubicacion = ubicacion;
}

Bicicleta.prototype.toString = function (){
    return `id: ${this.id} | color: ${this.color}`;
}

Bicicleta.allBicis = [];

Bicicleta.remove = function(biciId) {
    for (var i = 0; i < Bicicleta.allBicis.length; i++){
        var currBici = Bicicleta.allBicis[i];
        if (currBici.id == biciId){
            Bicicleta.allBicis.splice(i, 1);
            break;
        }
    }
}

Bicicleta.findById = function (id){
    for (var i = 0; i < Bicicleta.allBicis.length; i++){
        var currBici = Bicicleta.allBicis[i];
        if (currBici.id == id){
            return currBici;
        }
    }
    throw new Error("No existe una bicicleta con id " + id);
}

Bicicleta.prototype.add = function(){
    Bicicleta.allBicis.push(this);
}
*/
/*
var a = new Bicicleta(1, "rojo", "supreme", [51.508, -0.11]);
var b = new Bicicleta(2, "azul", "aventura", [51.495, -0.149]);

a.add();
b.add();
*/

// module.exports = Bicicleta;
