'use strict';
var test = require ('tape');
var request = require ('supertest');
var app = require ('../SPSProgetto/index');

test ('Correct triggers list', async function (t) {
    request (app)
        .get ('../trigger')
        .expect ('Content-Type', 'text/html; charset=utf-8')
        .expect (200)
        .end ( function (err, res) {
            var exprectedTriggers = [
                {
                    "_id": "61b1e65c3d370fa548dec3a2",
                    "Dispositivo": {
                        "_id": "61b1c4ef3d370fa548dec35b",
                        "ConsumiDichiarati": 0.072,
                        "DispositivoName": "LampadinaLed1",
                        "Locazione": {
                            "tipo": "stanza",
                            "stanza": null
                        },
                        "Tipo": "Luce"
                    }
                },
                {
                    "_id": "61b1e70b3d370fa548dec3a4",
                    "Dispositivo": {
                        "_id": "61b1c8bf3d370fa548dec35e",
                        "ConsumiDichiarati": 105.6,
                        "DispositivoName": "Scaldabagno",
                        "Locazione": {
                            "tipo": "stanza",
                            "stanza": null
                        },
                        "Tipo": "Calore"
                    }
                },
                {
                    "_id": "61b1e74c3d370fa548dec3a5",
                    "Dispositivo": {
                        "_id": "61b1caa93d370fa548dec361",
                        "ConsumiDichiarati": 36,
                        "DispositivoName": "StufaElettrica",
                        "Locazione": {
                            "tipo": "stanza",
                            "stanza": null
                        },
                        "Tipo": "Calore"
                    }
                },
                {
                    "_id": "61b1e77e3d370fa548dec3a6",
                    "Dispositivo": {
                        "_id": "61b1cae43d370fa548dec362",
                        "ConsumiDichiarati": 0.657,
                        "DispositivoName": "LavatriceA",
                        "Locazione": {
                            "tipo": "stanza",
                            "stanza": null
                        },
                        "Tipo": "Lavaggio"
                    }
                },
                {
                    "_id": "61b1e7e23d370fa548dec3a7",
                    "Dispositivo": {
                        "_id": "61b1d99a3d370fa548dec394",
                        "ConsumiDichiarati": 0.84,
                        "DispositivoName": "Frigorifero",
                        "Locazione": {
                            "tipo": "stanza",
                            "stanza": null
                        },
                        "Tipo": "Frigo"
                    }
                },
                {
                    "_id": "61b1e8213d370fa548dec3a9",
                    "Dispositivo": {
                        "_id": "61b1d6e73d370fa548dec391",
                        "ConsumiDichiarati": 0.072,
                        "DispositivoName": "LampadinaLed3",
                        "Locazione": {
                            "tipo": "stanza",
                            "stanza": null
                        },
                        "Tipo": "Luce"
                    }
                },
                {
                    "_id": "61bb17f639967dd6ac32d6e0",
                    "Dispositivo": {
                        "_id": "61b1c4ef3d370fa548dec35b",
                        "ConsumiDichiarati": 0.072,
                        "DispositivoName": "LampadinaLed1",
                        "Locazione": {
                            "tipo": "stanza",
                            "stanza": null
                        },
                        "Tipo": "Luce"
                    }
                }
            ];

            t.error (err, 'Error', 'No error');
            t.same (res, exprectedTriggers, 'Triggers as expected');
            t.end();
        });
});