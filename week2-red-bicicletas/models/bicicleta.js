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
/*
var a = new Bicicleta(1, "rojo", "supreme", [51.508, -0.11]);
var b = new Bicicleta(2, "azul", "aventura", [51.495, -0.149]);

a.add();
b.add();
*/

module.exports = Bicicleta;
 