var mongoose = require('mongoose');
var Bicicleta = require("../../models/bicicleta");

describe("Testing Bicicletas", function () {
    beforeAll(function (done) {
        var mongoDB = "mongodb://127.0.0.1/test";
        mongoose.connect(mongoDB, { useNewUrlParser: true });

        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error'));
        db.once('open', function () {
            console.log("We are connected to test database.");
            done();
        });
    });
    
    afterAll(function(done){
        mongoose.connection.close();
        done();
    })

    afterEach(function (done) {
        Bicicleta.deleteMany({}, function (err, success) {
            if (err) console.log(err);
            done();
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
        it("comienza vacía", (done) => {
            Bicicleta.allBicis(function (err, bicis) {
                expect(bicis.length).toBe(0);
                done();
            });

        });
    });

    describe('Bicicleta.add', () => {
        it("agregar una bici", (done) => {
            var bici = Bicicleta.createInstance(1, "rojo", "supreme", [51.508, -0.11]);
            Bicicleta.add(bici, function (err, newBici) {
                if (err) console.log(err);
                Bicicleta.allBicis(function (err, bicis) {
                    expect(bicis.length).toEqual(1);
                    expect(bicis[0].code).toEqual(bici.code);

                    done();
                });
            });
        });
    });

    describe('Bicicleta.findByCode', () => {
        it("debe devolver bici con code 1", (done) => {
            var bici = Bicicleta.createInstance(1, "rojo", "supreme", [51.508, -0.11]);

            Bicicleta.add(bici, function (err, newBici) {
                if (err) console.log(err);
                var bici2 = Bicicleta.createInstance(1, "rojo", "supreme", [51.508, -0.11]);
                Bicicleta.add(bici2, function (err, newBici) {
                    Bicicleta.allBicis(async function (err, bicis) {
                        const bicilist = await Bicicleta.find();
                        console.log(bicilist);
                        expect(bicis.length).toEqual(2);
                        Bicicleta.findByCode(bici.code, function (err, biciTest) {
                            expect(biciTest.code).toBe(1);
                            expect(biciTest.color).toBe("rojo");
                            expect(biciTest.modelo).toBe("supreme");
                            expect(biciTest.ubicacion[0]).toEqual(51.508);
                            expect(biciTest.ubicacion[1]).toEqual(-0.11);
                            done();
                        });
                    });
                });
            });
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