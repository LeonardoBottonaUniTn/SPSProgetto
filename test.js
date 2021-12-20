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
            let body = res.body;
        });
  });
}

/**
 * Tempo per il server di connettersi a MongoDB. Soluzione molto brutta ma in
 * questo poco tempo si fa quel che si può.
 */
setTimeout(main, 3000);
