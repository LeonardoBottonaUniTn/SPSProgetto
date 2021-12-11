var Express = require ("express");
var bodyParser = require ("body-parser");

// add MongoDB Client
var MongoClient = require ("mongodb").MongoClient;
var MongoDB = require("mongodb");

// definition of the connection string
var CONNECTION_STRING = "mongodb+srv://G38:pass_G38@sps.94fac.mongodb.net/test";  // molto sicuro

var app = Express ();
app.use(bodyParser.json ());
app.use(bodyParser.urlencoded ({ extended: true }) );

//name of the created MongoDB
var DATABASE = "SPS_db";
var database;

const swaggerJsDoc = require ('swagger-jsdoc');
const swaggerUI = require ('swagger-ui-express');

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "Smart Property System API",
            description: "Smart Property System API Information",
            contact: {
                name: "Leonardo Bottona"
            },
            servers: ["http://localhost:49146"]
        }
    },
    apis: ["index.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use ('/api-docs', swaggerUI.serve, swaggerUI.setup (swaggerDocs));

app.listen(49146, () => {
    //MongoDB connection
    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true,
    useUnifiedTopology: true}, (error, client) => {
        if(error){
            console.log("Error connecting at the MongoDB: "+ error);
        }else{
            database = client.db(DATABASE);
            console.log("MongoDB Connection Successfull");
        }
    })
});

var cors = require('cors');
app.use(cors());

app.get( '/', (request, response) => {
    response.send('Ciao Gaia');
});

MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true,
  useUnifiedTopology: true}, (error, client) => {
    if(error) {
      console.log("Error connecting at the MongoDB: "+ error);
      return;
    }

    const calculateResults = response => {
      return results => {
        let consumo = 0;
        for(r of results) {
          consumo += r.ConsumoGiornaliero;
        }
        response.json({ consumo });
      }
    }

    /* DISPOSITIVI */

    app.get('/dispositivi', (req, res) => {
      const db = client.db(DATABASE);
      const cursor = db.collection('dispositivo').find();
      cursor.toArray().then(results => res.json(results));
    });

    app.get('/dispositivi/:id', (req, res) => {
      let id;
      try {
        id = MongoDB.ObjectId(req.params.id);
      } catch(exc) {
        res.json({ errore: "ID del dispositivo invalido."});
        return;
      }

      const db = client.db(DATABASE);
      db.collection('dispositivo').findOne(id)
        .then(results => res.json(results))
        .catch(err => res.send(err));
    });

    app.post('/dispositivi', (req, res) => {
      const db = client.db(DATABASE);
      const collection = db.collection('dispositivo');
      collection.insertOne(req.body)
        .then(result => {
          res.send(result)
        })
        .catch(error => console.error(error));
    });

    app.put("/dispositivi/:id", (req, res) => {
      let id;
      try {
        id = MongoDB.ObjectId(req.params.id);
      } catch(exc) {
        res.json({ errore: "ID del dispositivo invalido."});
        return;
      }
    });

    app.delete("/dispositivi/:id", (req, res) => {
      let id;
      try {
        id = MongoDB.ObjectId(req.params.id);
      } catch(exc) {
        res.json({ errore: "ID del dispositivo invalido."});
        return;
      }

      const db = client.db(DATABASE);
      db.collection('dispositivo').deleteOne({ "_id": id })
        .then(results => res.json(results))
        .catch(err => res.send(err));
    });

    /* CONSUMI */

    app.get("/consumi/proprieta/:id", (req, res) => {
      let id;
      try {
        id = MongoDB.ObjectId(req.params.id);
      } catch(exc) {
        res.json({ errore: "ID della proprietà invalido."});
        return;
      }
      let { datetimeStart, datetimeEnd } = req.body;

      const db = client.db(DATABASE);
      db.collection('stanza').find({  // Cerca le stanze dentro la proprietà
        "Proprieta": id,
      })
        .toArray()
        .then(results => {  // Cerca i dispositivi contenuti nelle stanze dentro la proprietà o nella proprietà stessa
          return db.collection("dispositivo").find({
            $or: [
              {
                "Locazione.tipo": "stanza",
                "Locazione.id": { $in: results.map(stanza => MongoDB.ObjectId(stanza._id)) }
              },
              {
                "Locazione.tipo": "proprietà",
                "Locazione.id": id
              }
            ]
          })
          .toArray();
        })
        .then(results => {  // Cerca i consumi di quei dispositivi
          return db.collection("consumi").find({
            "DispositivoId": {
              $in: results.map(dispositivo => MongoDB.ObjectId(dispositivo._id)),
            },
            "Date": { $gte: datetimeStart, $lt: datetimeEnd },
          })
          .toArray();
        })
        .then(calculateResults(res))
        .catch(err => res.send(err));
    });

    app.get("/consumi/stanze/:id", (req, res) => {
      let id;
      try {
        id = MongoDB.ObjectId(req.params.id);
      } catch(exc) {
        res.json({ errore: "ID della proprietà invalido."});
        return;
      }
      let { datetimeStart, datetimeEnd } = req.body;

      const db = client.db(DATABASE);
      db.collection('dispositivo').find({
        "Locazione.tipo": "stanza",
        "Locazione.id": id,
      })
        .toArray()
        .then(results => {
          return db.collection("consumi").find({
            "DispositivoId": {
              $in: results.map(dispositivo => MongoDB.ObjectId(dispositivo._id)),
            },
            "Date": { $gte: datetimeStart, $lt: datetimeEnd },
          })
          .toArray();
        })
        .then(calculateResults(res))
        .catch(err => res.send(err));
    });

    app.get("/consumi/dispositivi/:id", (req, res) => {
      let id;
      try {
        id = MongoDB.ObjectId(req.params.id);
      } catch(exc) {
        res.json({ errore: "ID della proprietà invalido."});
        return;
      }
      let { datetimeStart, datetimeEnd } = req.body;
      console.log(datetimeEnd,datetimeStart);

      const db = client.db(DATABASE);
      let sum = db.collection('consumi').find({
        "DispositivoId": id, "Date": { $gte: datetimeStart, $lt: datetimeEnd }
      })
        .toArray()
        .then(calculateResults(res))
        .catch(err => res.send(err));
    });

    app.get("/consumi/utenti/:id", (req, res) => {
    });

    /* TRIGGER */

    app.get("/trigger", (req, res) => {
      const db = client.db(DATABASE);
      const cursor = db.collection('trigger').find();
      cursor.toArray().then(results => res.json(results));
    });

    app.get("/trigger/:id", (req, res) => {
      let id;
      try {
        id = MongoDB.ObjectId(id);
      } catch(exc) {
        res.json({ errore: "ID del trigger invalido." });
        return;
      }

      const db = client.db(DATABASE);
      cursor = db.collection('trigger').findOne(id)
        .then(result => res.json(result))
        .catch(err => res.json(err));
    });

    app.post("/trigger", (req, res) => {
      const db = client.db(DATABASE);
      const collection = db.collection('trigger');
      collection.insertOne(req.body)
        .then(result => {
          res.send(result)
        })
        .catch(error => console.error(error));
    });

    app.put("/trigger/:id", (req, res) => {
      let id;
      try {
        id = MongoDB.ObjectId(req.params.id);
      } catch(exc) {
        res.json({ errore: "ID del dispositivo invalido."});
        return;
      }
    });

    app.delete("/trigger/:id", (req, res) => {
      let id;
      try {
        id = MongoDB.ObjectId(req.params.id);
      } catch(exc) {
        res.json({ errore: "ID del dispositivo invalido."});
        return;
      }

      const db = client.db(DATABASE);
      db.collection('trigger').deleteOne({ "_id": id })
        .then(results => res.json(results))
        .catch(err => res.send(err));
    });
})
