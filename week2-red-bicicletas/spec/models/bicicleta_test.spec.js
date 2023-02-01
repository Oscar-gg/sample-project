var mongoose = require('mongoose');
var Bicicleta = require("../../models/bicicleta");

describe("Testing Bicicletas", function () {
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
    });

    afterEach(async function () {
        await Bicicleta.deleteMany({}).then((out) => {
            // console.log(out);
        });
    });

    describe('Bicicleta.createInstance', () => {
        it("crear instancia de Bicicleta", () => {
            var bici = Bicicleta.createInstance(1, "rojo", "supreme", [51.508, -0.11]);
            expect(bici.code).toBe(1);
            expect(bici.color).toBe("rojo");
            expect(bici.modelo).toBe("supreme");
            expect(bici.ubicacion[0]).toEqual(51.508);
            expect(bici.ubicacion[1]).toEqual(-0.11);
        });
    });

    describe('Bicicleta.allBicis', () => {
        it("comienza vacía", () => {
            Bicicleta.allBicis().then(bicis => {
                expect(bicis.length).toBe(0);
            });

        });
    });

    describe('Bicicleta.add', () => {
        it("agregar una bici", () => {
            var bici = Bicicleta.createInstance(1, "rojo", "supreme", [51.508, -0.11]);
            return Bicicleta.add(bici).then(() => Bicicleta.allBicis()).then(bicis => {
                expect(bicis.length).toEqual(1);
                expect(bicis[0].code).toEqual(bici.code);
            });
        });
    });

    describe('Bicicleta.findByCode', () => {
        it("debe devolver bici con code 1", async () => {
            var bicis = await Bicicleta.allBicis();
            expect(bicis.length).toBe(0);

            var bici = Bicicleta.createInstance(1, "rojo", "supreme", [51.508, -0.11]);
            await Bicicleta.add(bici);
            var bici2 = Bicicleta.createInstance(2, "Azul", "Aventuras", [51.519, -0.114]);
            await Bicicleta.add(bici2);

            bicis = await Bicicleta.allBicis();
            expect(bicis.length).toBe(2);

            var resBici = await Bicicleta.findByCode(1);
            expect(resBici.code).toBe(1);
            expect(resBici.color).toBe("rojo");
            expect(resBici.modelo).toBe("supreme");
            expect(resBici.ubicacion[0]).toEqual(51.508);
            expect(resBici.ubicacion[1]).toEqual(-0.11);

            resBici = await Bicicleta.findByCode(2);

            expect(resBici.code).toBe(2);
            expect(resBici.color).toBe("Azul");
            expect(resBici.modelo).toBe("Aventuras");
            expect(resBici.ubicacion[0]).toEqual(51.519);
            expect(resBici.ubicacion[1]).toEqual(-0.114);
        });
    });
});


/*
beforeEach(() => {
    Bicicleta.allBicis = [];
});

describe("Bicicleta.allBicis", () => {
    it("Comienza vacio el arreglo", () => {
        expect(Bicicleta.allBicis.length).toBe(0);
    });
});

describe("Bicicleta.add()", () => {
    it("agregar bicicleta", () => {
        expect(Bicicleta.allBicis.length).toBe(0);

        var a = new Bicicleta(1, "rojo", "supreme", [51.508, -0.11]);
        a.add();

        expect(Bicicleta.allBicis.length).toBe(1);
        expect(Bicicleta.allBicis[0]).toBe(a);
    });
});

describe("Bicicleta.findById()", () => {
    it("encontrar bicicleta", () => {
        var a = new Bicicleta(1, "rojo", "supreme", [51.508, -0.11]);
        var b = new Bicicleta(2, "azul", "aventura", [51.495, -0.149]);
        a.add();
        b.add();
        expect(Bicicleta.allBicis.length).toBe(2);

        var bici = Bicicleta.findById(b.id);
        expect(bici.modelo).toBe(b.modelo);
        expect(bici.color).toBe(b.color);
        expect(bici.id).toBe(b.id);
    });
});

*/