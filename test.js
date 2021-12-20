'use strict';
var test = require ('tape');
var request = require ('supertest');
var app = require ('../SPSProgetto/index');

test ('Correct triggers list', async (t) =>  {
    await request (app)
        .get ('../trigger')
        .expect ('Content-Type', 'text/html; charset=utf-8')
        .expect (200)
        .end ( function (err, res) {
            var exprectedTriggers = [
                {
                    _id: "61bf58978888b39d86300d63",
                    Soglia: 1,
                    NomeTrigger: "Lampadina Salotto",
                    Dispositivo: {
                        _id: "61b1c4ef3d370fa548dec35b",
                        ConsumiDichiarati: 0.072,
                        DispositivoName: "LampadinaLed1",
                        Locazione: {
                            tipo: "stanza",
                            stanza: null
                        },
                        Tipo: "Luce"
                    }
                }
            ];
            t.error (err, 'No error');
            t.same (res, exprectedTriggers, 'Triggers as expected');
            t.end();

        });
});