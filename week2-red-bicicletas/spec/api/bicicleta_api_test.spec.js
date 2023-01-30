var mongoose = require("mongoose");
var Bicicleta = require("../../models/bicicleta");
const axios = require('axios');
var server = require("../../bin/www");

mongoose.disconnect();

/*
for (var prop in mongoose.connections[0]){
    console.log(prop);
}*/

console.log(mongoose.connections[0]._connectionString);

async function getRequest(link) {
    try {
        const response = await axios.get(link);
        console.log(`Res code: ${response.status}`);
        return response;
    } catch (error) {
        console.error(error);
    }
}

async function postRequest(link, bici) {
    try {
        const response = await axios.post(link, bici,
            { headers: { 'content-type': 'application/json' } }
        );
        console.log(`Res code: ${response.status}`);
        return response;
    } catch (error) {
        console.error(error);
    }
}

describe("Bicicleta API", () => {

    beforeAll(function (done) {
        var mongoDB = "mongodb://127.0.0.1/test";
        //mongoose.connect(mongoDB, { useNewUrlParser: true });

        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error'));
        db.once('open', function () {
            console.log("We are connected to test database.");
            done();
        });
    });

    afterEach(function (done) {
        Bicicleta.deleteMany({}, function (err, success) {
            if (err) console.log(err);
            done();
        })
    });

    describe("GET bicicletas /", () => {
        it("Response 200", async function () {
            const response = await getRequest('http://localhost:3000/api/bicicletas');
            console.log(response.data);
            expect(response.status).toBe(200);
            expect(response.data.bicicletas.length).toBe(0);
        });
    });

    describe("POST bicicletas /", () => {
        it("STATUS 200", async function () {
            expect(Bicicleta.allBicis.length).toBe(0);
            var a = new Bicicleta(1, "rojo", "supreme", [51.508, -0.11]);
            a.add();
            var testBici = { "id": 5, "modelo": "extremo", "color": "verde", "lat": 10, "lng": 20 };
            var link = 'http://localhost:3000/api/bicicletas/create';
            const response = await postRequest(link, testBici);
            expect(response.status).toBe(200);
            var resBici = await Bicicleta.findByCode(5);
            expect(resBici.color).toBe("verde");
            expect(resBici.modelo).toBe("supreme");
            expect(resBici.ubicacion[1]).toBe(-0.11);
        });
    });
});