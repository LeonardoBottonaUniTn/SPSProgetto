var Express = require ("express");
var bodyParser = require ("body-parser");

// add MongoDB Client
var MongoClient = require ("mongodb").MongoClient;
var MongoDB = require("mongodb");

// definition of the connection string
var CONNECTION_STRING = "mongodb+srv://G38:pass_G38@sps.94fac.mongodb.net/test";

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

    const getUser = req => {

    };

    /* DISPOSITIVI */

    app.post('/dispositivi', (req, res) => {
      const db = client.db(DATABASE);
      const collection = db.collection('dispositivo');
      collection.insertOne(req.body)
        .then(result => {
          res.send(result)
        })
        .catch(error => console.error(error));
    });

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
    });
    app.get("/consumi/stanze/:id", (req, res) => {
    });
    app.get("/consumi/dispositivi/:id", (req, res) => {
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
