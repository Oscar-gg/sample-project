var mongoose = require('mongoose');
var Bicicleta = require('../../models/bicicleta');
var Usuario = require('../../models/usuario');
var Reserva = require('../../models/reserva');

describe("Testing Usuarios", function () {
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
        await Reserva.deleteMany({}).then((out) => {
            if (out) console.log(out);
        });
        await Bicicleta.deleteAll();
        await Usuario.deleteMany({}).then((out) => {
            if (out) console.log(out);
        })
    });

    describe('cuando un usuario reserva una bici', () => {
        it('debe existir la reserva', (done) => {
            const usuario = new Usuario({ nombre: 'Ezequiel' , email : 'eze@gmail.com', password: 'ggez'});
            usuario.save();
            const bicicleta = new Bicicleta({ code: 1, color: 'verde', modelo: "urbana", ubicacion: [-20, 20] });
            bicicleta.save();

            var hoy = new Date();
            var manana = new Date();
            manana.setDate(hoy.getDate() + 2);
            usuario.reservar(bicicleta._id, hoy, manana, function (err, reserva) {
                Reserva.find({}).populate('bicicleta').populate('usuario').exec(function (err, reservas) {
                    console.log(reservas[0]);
                    expect(reservas.length).toBe(1);
                    expect(reservas[0].diasDeReserva()).toBe(3);
                    expect(reservas[0].bicicleta.code).toBe(1);
                    expect(reservas[0].usuario.nombre).toBe(usuario.nombre);
                    done();
                });
            });
        });
    });


})