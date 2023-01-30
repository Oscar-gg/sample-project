var mongoose = require('mongoose');
var Bicicleta = require('../../models/bicicleta');
var Usuario = require('../../models/usuario');
var Reserva = require('../../models/reserva');

describe("Testing Usuarios", function(){
    beforeAll(function(done){
        var mongoDB = 'mongodb://127.0.0.1/testdb';
        mongoose.connect(mongoDB, {useNewUrlParse: true});

        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error'));
        db.once('open', function(){
            console.log('We are connected to test database!')
            done();
        });
    });

    describe('Cuando un Usuario reserva una bici', () => {
        it('debe existir la reserva', (done) => {
            const usuario = new Usuario({nombre: 'Ezequiel'});
            usuario.save();
            const bicicleta = new Bicicleta({code: 1, color: 'verde', modelo: "urbana"});
            bicicleta.save();

            var hoy = new Date();
            var manana = new Date();
            manana.setDate(hoy.getDate()+1);
            usuario.reservar(bicicleta.id, hoy, manana, function(err, reserva){
                Reserva.find({}).populate('bicicleta').populate('usuario').exec(function(err, reservas){
                    console.log(reservas[0]);
                    expect(reservas.length).toBe(1);
                    expect(reservas[0].diasDeReserva).toBe(2);
                    expect(reservas[0].bicicleta.code).toBe(1);
                    expect(reservas[0].usuario.nombre).toBe(usuario.nombre);
                });
            });
        });
    });


})