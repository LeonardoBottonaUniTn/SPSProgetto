'use strict';
var test = require ('tape');
var request = require ('supertest');
var app = require ('./server/app');

function main() {
  test('Correct triggers list', function (assert) {
      request(app)
        .get("/trigger")
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          var expectedTrigger = [
            {
                _id: "61bf58978888b39d86300d63",
                Soglia: 2,
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
          assert.error (err, 'No error');
          assert.same (res.body, expectedTrigger, 'Triggers as expected');
          assert.end();
        });
  });
  test ('Trigger correctly add', function (assert) {
    request(app)
        .post ('/trigger')
        .send ({
          Dispositivo: "61b1c4ef3d370fa548dec35b",
          Soglia: 1,
          NomeTrigger: "Lampadina Salotto HYPER"
        })
        .expect (201)
        .end (function (err, res) {
          assert.error (err, 'No error');
          assert.same (res.body.acknowledged, true, 'Trigger correctly add');
          assert.end ();
        });
  });
  test (' Trigger modify correctly', function (assert) {
    request (app)
      .put ('/trigger/61bf58978888b39d86300d63')
      .send ({
        Dispositivo: "61b1c4ef3d370fa548dec35b",
        Soglia: 1,
        NomeTrigger: "Lampadina Salotto"
      })
      .expect (200)
      .expect ('Content-Type', /json/)
      .end (function (err, res) {
        var expectedTrigger =
          {
            "acknowledged": true,
            "modifiedCount": 1,
            "upsertedId": null,
            "upsertedCount": 0,
            "matchedCount": 1
          };
        assert.error (err, 'No error');
        assert.same (res.body, expectedTrigger,  'Trigger as expected');
        assert.end ();
      });
  });
  test ('Trigger correctly deleted', function (assert) {
    request(app)
      .delete ('/trigger/61bf58978888b39d86300d63')
      .expect (200)
      .expect ('Content-Type', /json/)
      .end ( function (err, res) {
        var expectedTrigger = {
          "acknowledged": true,
          "deletedCount": 1
        }
        assert.error (err, 'No error');
        assert.same (res.body, expectedTrigger, 'Trigger correctly deleted');
        assert.end ();
      })
  });
}

/**
 * Tempo per il server di connettersi a MongoDB. Soluzione molto brutta ma in
 * questo poco tempo si fa quel che si può.
 */
setTimeout(main, 3000);