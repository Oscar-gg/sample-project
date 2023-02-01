// File to test mongoose queries using then().

function testMongoose() {
    var mongoose = require("mongoose");
    var Bicicleta = require("../../models/bicicleta");

    var mongoDB = "mongodb://127.0.0.1/testt";
    mongoose.connect(mongoDB).catch(function (err) {
        if (err) {
            mongoose.connection.useDb('testt');
        }
    });

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', function () {
        console.log("We are connected to test database.");
    });

    /*
    var a = Bicicleta.createInstance(1, "rojo", "supreme", [51.508, -0.11]);
    Bicicleta.add(a);
    */

    var test = Bicicleta.removeByCode(1);
    test.then((res) => console.log(res)).then(console.log("Finished"));

    console.log("End of program");
}

function testEmail() {
    console.log("Probando regex de email.");

    email = "oscar.arreola.jr@gmail.com";

    const validateEmail = function (email) {
        const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return re.test(email);
    }

    if (validateEmail(email)) {
        console.log(`El email ${email} es valido`);
    } else {
        console.log(`El email ${email} NO es valido`);
    }
}

testEmail();
