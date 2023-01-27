var Bicicleta = require("../../models/bicicleta");

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