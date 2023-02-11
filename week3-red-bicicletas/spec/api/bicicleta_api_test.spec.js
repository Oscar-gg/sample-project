var mongoose = require("mongoose");
var Bicicleta = require("../../models/bicicleta");
const axios = require('axios');
var server = require("../../bin/www");
const Usuario = require("../../models/usuario");

let token = null;

async function getRequest(link) {
    try {
        const response = await axios.get(link, { headers: { 'content-type': 'application/json', 'x-access-token': token } });
        return response;
    } catch (error) {
        console.error(error);
    }
}

async function postRequest(link, bici) {
    try {
        const response = await axios.post(link, bici,
            { headers: { 'content-type': 'application/json', 'x-access-token': token } }
        );
        return response;
    } catch (error) {
        console.error(error);
    }
}

async function deleteRequest(link, id) {
    try {
        const response = await axios.delete(link, {
            headers: {
                'content-type': 'application/json', 'x-access-token': token
            },
            data: {
                id: id
            }
        }
        );
        return response;
    } catch (error) {
        console.error(error);
    }
}

describe("Bicicleta API", () => {
    beforeAll(async function () {
        var mongoDB = "mongodb://127.0.0.1/test";
        await mongoose.connect(mongoDB).catch(function (err) {
            if (err) {
                mongoose.connection.useDb('test');
            }
        });

        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error'));
        db.once('open', function () {
            console.log("We are connected to test database.");
        });

        await Usuario.deleteMany({});

        // Crear usuario para obtener token, autenticarse y hacer requests.
        const usuarioTest = new Usuario({ nombre: "test", email: "test@test.com", password: "1234", verificado: true });
        await usuarioTest.save();
        await fetch('http://localhost:3000/api/auth/authenticate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: "test@test.com", password: "1234" })
        }).then((res) => res.json()).then((data) => token = data.data.token).catch((err) => console.log(err));
    });

    afterEach(async function () {
        await Bicicleta.deleteAll().then((out) => {
            //console.log(out);
        });
    });

    describe("GET bicicletas /", () => {
        it("Response 200", async function () {
            const response = await getRequest('http://localhost:3000/api/bicicletas');
            expect(response.status).toBe(200);
            expect(response.data.bicicletas.length).toBe(0);
        });
    });

    describe("POST bicicletas /", () => {
        it("STATUS 200", async function () {
            await Bicicleta.allBicis().then((bicis) => expect(bicis.length).toBe(0));

            var a = Bicicleta.createInstance(1, "rojo", "supreme", [51.508, -0.11]);
            await Bicicleta.add(a);

            var testBici = { "id": 5, "modelo": "extremo", "color": "verde", "lat": 10, "lng": 20 };
            var link = 'http://localhost:3000/api/bicicletas/create';
            const response = await postRequest(link, testBici);

            expect(response.status).toBe(200);
            var resBici = await Bicicleta.findByCode(5);
            expect(resBici.color).toBe("verde");
            expect(resBici.modelo).toBe("extremo");
            expect(resBici.ubicacion[1]).toBe(20);

            var resBici2 = await Bicicleta.findByCode(1);
            expect(resBici2.color).toBe("rojo");
            expect(resBici2.modelo).toBe("supreme");
            expect(resBici2.ubicacion[1]).toBe(-0.11);
            expect(resBici2.ubicacion[0]).toBe(51.508);
        });
    });

    describe("Delete bicicletas /", () => {
        it("Status 200", async function () {
            var bici = Bicicleta.createInstance(1, "azul", "exclusive", [51.508, -0.11]);
            var bici2 = Bicicleta.createInstance(2, "Aqua", "avatar", [51.508, -0.11]);
            var bici3 = Bicicleta.createInstance(5, "amarilla", "2023", [51.508, -0.11]);
            var bici4 = Bicicleta.createInstance(6, "azul", "gama alta", [51.508, -0.11]);

            await Bicicleta.add(bici);
            await Bicicleta.add(bici2);
            await Bicicleta.add(bici3);
            await Bicicleta.add(bici4);
            await Bicicleta.allBicis().then((bicis) => expect(bicis.length).toBe(4));

            var link = 'http://localhost:3000/api/bicicletas/delete';
            var response = await deleteRequest(link, 1);
            response = await deleteRequest(link, 2);
            expect(response.status).toBe(200);

            var responseGet = await getRequest('http://localhost:3000/api/bicicletas');
            expect(responseGet.status).toBe(200);
            expect(responseGet.data.bicicletas.length).toBe(2);

            response = await deleteRequest(link, 5);
            response = await deleteRequest(link, 6);

            responseGet = await getRequest('http://localhost:3000/api/bicicletas');
            expect(responseGet.status).toBe(200);
            expect(responseGet.data.bicicletas.length).toBe(0);

        });
    });
});