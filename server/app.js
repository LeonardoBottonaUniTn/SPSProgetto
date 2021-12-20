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
    apis: ['./server/*.js'],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use ('/api-docs', swaggerUI.serve, swaggerUI.setup (swaggerDocs));

var cors = require('cors');
app.use(cors());

app.get('/', (request, response) => {
    response.send('Ciao Gaia');
});

let client = null;

MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true},
  (error, client) => {
    if(error) {
      console.log("Error connecting at the MongoDB: "+ error);
      return;
    }

    const calculateResults = response => {
      return consumi => {
        let consumoTotale = 0;
        for(c of consumi) {
          consumoTotale += c.ConsumoGiornaliero;
        }
        response.json({ consumo: consumoTotale });
      }
    }

    const validateBody = async (body, api) => {
      const db = client.db(DATABASE);
      if(api === "trigger") {
        const allowedKeys = ["Dispositivo", "Soglia", "NomeTrigger"];
        for(const key of Object.keys(body)) {
          if(!allowedKeys.includes(key)) return `Parametro sconosciuto: ${key}`;
        }
        for(const key of allowedKeys) {
          if(!Object.keys(body).includes(key)) return `Parametro mancante: ${key}`;
        }

        if(typeof(body.Dispositivo) !== "string") return `Dispositivo non contiene un ID valido`;
        else {
          try {
            let disp = await db.collection("dispositivo").findOne(MongoDB.ObjectId(body.Dispositivo));
            if(!disp) return `Dispositivo contiene un ID di un dispositivo inesistente`;
          }
          catch(exc) { return `Dispositivo non contiene un ID valido` }
        }
        if(typeof(body.Soglia) !== "number") return `Soglia deve essere un numero`;
        if(typeof(body.NomeTrigger) !== "string") return `NomeTrigger deve essere una stringa`;
      }
      else if(api === "dispositivi") {
        const allowedKeys = ["ConsumiDichiarati", "DispositivoName", "Locazione", "Tipo"];
        for(const key of Object.keys(body))
          if(!allowedKeys.includes(key)) return `Parametro sconosciuto: ${key}`;
        for(const key of allowedKeys)
          if(!Object.keys(body).includes(key)) return `Parametro mancante: ${key}`;

        const allowedKeysLocazione = ["tipo", "id"];
        for(const key of Object.keys(body.Locazione))
          if(!allowedKeysLocazione.includes(key)) return `Parametro sconosciuto: Locazione.${key}`;
        for(const key of allowedKeysLocazione)
          if(!Object.keys(body.Locazione).includes(key)) return `Parametro mancante: ${key}`;

        if(typeof(body.Locazione.tipo) !== "string" || !["stanza", "proprietà"].includes(body.Locazione.tipo))
          return `Locazione.tipo deve essere "stanza" o "proprietà"`;
        if(typeof(body.Locazione.id) !== "string") return `Locazione.id non contiene un ID valido`;
        else {
          try {
            let locazione = await db.collection(body.Locazione.tipo).findOne(MongoDB.ObjectId(body.Locazione.id));
            if(!locazione) return `Locazione.id contiene un ID di una ${body.Locazione.tipo} inesistente`;
          }
          catch(exc) { return `Locazione.id non contiene un ID valido` }
        }
        if(typeof(body.ConsumiDichiarati) !== "number") return `ConsumiDichiarati deve essere un numero`;
        if(typeof(body.DispositivoName) !== "string") return `DispositivoName deve essere una stringa`;
        const allowedTypes = ["Luce", "Calore", "Lavaggio", "GoogleHome", "Frigo"];
        if(typeof(body.Tipo) !== "string") return `Tipo deve essere una stringa`;
        else if(!allowedTypes.includes(body.Tipo)) return `Tipo deve essere una stringa`;
      }

      return null;
    }

    const exists = async (coll, id) => {
      try {
        const db = client.db(DATABASE);
        const item = await db.collection(coll).findOne(MongoDB.ObjectId(id));
        return item !== null;
      } catch(exc) { return false; }
    }

    const expandDispositivo = async disp => {
      if(disp === null) return null;

      const db = client.db(DATABASE);
      let Locazione;
      if(disp.Locazione.tipo === "stanza") {
        let stanza = await db.collection("stanza").findOne(MongoDB.ObjectId(disp.Locazione.id));
        Locazione = {
          tipo: disp.Locazione.tipo,
          stanza: await expandStanza(stanza),
        };
      }
      else if(disp.Locazione.tipo === "proprietà") {
        let proprieta = await db.collection("proprieta").findOne(MongoDB.ObjectId(disp.Locazione.id));
        Locazione = {
          tipo: disp.Locazione.tipo,
          proprieta,
        };
      }

      return {
        ...disp,
        Locazione,
      };
    }

    const expandStanza = async stanza => {
      if(stanza === null) return null;

      const db = client.db(DATABASE);
      return {
        ...stanza,
        Proprieta: await db.collection("proprietà").findOne(MongoDB.ObjectId(stanza.Proprieta))
      }
    }

    /**
     * @openapi
     * /dispositivi:
     *   get:
     *     tags:
     *       - Dispositivi
     *     summary: Restituisce una lista di dispositivi.
     *     responses:
     *       '200':
     *         description: Un Array JSON di dispositivi.
     */
    app.get('/dispositivi', async (req, res) => {
      const db = client.db(DATABASE);
      const cursor = db.collection('dispositivo').find();
      cursor.toArray().then(async results => {
        for(let i = 0; i < results.length; i++)
          results[i] = await expandDispositivo(results[i])
        res.json(results);
      });
    });

    /**
     * @openapi
     * /dispositivi/{id_dispositivo}:
     *   get:
     *     tags:
     *       - Dispositivi
     *     summary: Restituisce un dispositivo.
     *     parameters:
     *       - name: id_dispositivo
     *         in: path
     *         required: true
     *         description: L'ID del dispositivo.
     *     responses:
     *       '200':
     *         description: Un dispositivo.
     *       '404':
     *         description: "`null`: Nessun dispositivo con quell'ID è stato trovato."
     *       '400':
     *         description: L'ID inserito è invalido.
     */
    app.get('/dispositivi/:id', async (req, res) => {
      let id;
      try {
        id = MongoDB.ObjectId(req.params.id);
      } catch(exc) {
        res.status(400).json({ errore: "ID del dispositivo invalido." });
        return;
      }

      const db = client.db(DATABASE);
      db.collection('dispositivo').findOne(id)
        .then(result => expandDispositivo(result))
        .then(result => res.status(result ? 200 : 404).json(result))
        .catch(err => res.send(err));
    });

    /**
     * @openapi
     * /dispositivi/{id_dispositivo}/consumo:
     *   get:
     *     tags:
     *       - Dispositivi
     *     summary: Restituisce i kWh consumati in un periodo di tempo da un dispositivo.
     *     parameters:
     *       - name: id_dispositivo
     *         in: path
     *         required: true
     *         description: L'ID del dispositivo.
     *     description: |
     *       Restituisce i kWh consumati da un dispositivo in un periodo di tempo. Si possono anche specificare la data di inizio e di fine nel body della richiesta.
     *       ```json
     *       {
     *         "dateStart": "YYYY-MM-DD",
     *         "dateEnd": "YYYY-MM-DD"
     *       }
     *       ```
     *       Entrambi gli attributi sono opzionali, e vengono ignorati se i dati inseriti non sono sintatticamente corretti.
     *     responses:
     *       '200':
     *         description: Il consumo in kWh del dispositivo.
     *       '404':
     *         description: "Nessun dispositivo con quell'ID è stato trovato."
     *       '400':
     *         description: L'ID inserito è invalido.
     */
    app.get("/dispositivi/:id/consumo", async (req, res) => {
      let id;
      try {
        id = MongoDB.ObjectId(req.params.id);
      } catch(exc) {
        res.status(400).json({ errore: "ID del dispositivo invalido."});
        return;
      }
      if(!(await exists("dispositivo", id))) {
        res.status(404).json({ errore: "Il dispositivo non esiste." });
        return;
      }
      let { datetimeStart, datetimeEnd } = req.body;

      const db = client.db(DATABASE);
      let sum = db.collection('consumi').find({
        "DispositivoId": id, "Date": { $gte: datetimeStart, $lt: datetimeEnd }
      })
        .toArray()
        .then(calculateResults(res))
        .catch(err => res.send(err));
    });

    /**
     * @openapi
     * /dispositivi:
     *   post:
     *     tags:
     *       - Dispositivi
     *     summary: Aggiunge un dispositivo.
     *     description: |
     *       Aggiunge un dispositivo con i dati passati. Il body della richiesta deve contenere un JSON come segue:
     *       ```json
     *       {
     *         "ConsumiDichiarati": "float"
     *         "DispositivoName": "string",
     *         "Tipo": "Luce|Calore|Lavaggio|GoogleHome|Frigo",
     *         "Locazione": {
     *           "tipo": "stanza|proprietà",
     *           "id": "string",
     *         }
     *       }
     *       ```
     *     responses:
     *       '201':
     *         description: Il dispositivo è stato aggiunto.
     *       '400':
     *         description: I dati inseriti non sono corretti.
     */
    app.post('/dispositivi', async (req, res) => {
      const db = client.db(DATABASE);
      const collection = db.collection('dispositivo');

      let error = await validateBody(req.body, "dispositivi");
      if(error) {
        res.status(400).json({ error });
        return;
      }
      const dispositivo = {
        ...req.body,
        Locazione: {
          ...req.body.Locazione,
          id: MongoDB.ObjectId(req.body.Locazione.id),
        },
      };

      collection.insertOne(dispositivo)
        .then(result => res.send(result))
        .catch(error => res.status(500).send(error));
    });

    /**
     * @openapi
     * /dispositivi/{id_dispositivo}:
     *   put:
     *     tags:
     *       - Dispositivi
     *     summary: Modifica un dispositivo.
     *     parameters:
     *       - name: id_dispositivo
     *         in: path
     *         required: true
     *         description: L'ID del dispositivo.
     *     description: |
     *       Modifica i dati passati. Il body della richiesta deve contenere un JSON come segue:
     *       ```json
     *       {
     *         "ConsumiDichiarati": "float"
     *         "DispositivoName": "string",
     *         "Tipo": "Luce|Calore|Lavaggio|GoogleHome|Frigo",
     *         "Locazione": {
     *           "tipo": "stanza|proprietà",
     *           "id": "string",
     *         }
     *       }
     *       ```
     *     responses:
     *       '200':
     *         description: Il dispositivo è stato modificato.
     *       '400':
     *         description: L'ID inserito è invalido o non sono corretti i dati.
     *       '404':
     *         description: Il dispositivo non esiste.
     */
    app.put("/dispositivi/:id", async (req, res) => {
      let id;
      try {
        id = MongoDB.ObjectId(req.params.id);
      } catch(exc) {
        res.status(400).json({ errore: "ID del dispositivo invalido."});
        return;
      }
      if(!(await exists("dispositivo", id))) {
        res.status(404).json({ errore: "La proprietà non esiste." });
        return;
      }

      let error = await validateBody(req.body, "dispositivi");
      if(error) {
        res.status(400).json({ error });
        return;
      }
      const dispositivo = {
        ...req.body,
        Locazione: {
          ...req.body.Locazione,
          id: MongoDB.ObjectId(req.body.Locazione.id),
        },
      };

      const db = client.db(DATABASE);
      db.collection('dispositivo').updateOne({ _id: id }, { $set: req.body })
        .then(result => {
          res.send(result)
        })
        .catch(error => { console.error(error); res.status(500).send(error) });
    });

    /**
     * @openapi
     * /dispositivi/{id_dispositivo}:
     *   delete:
     *     tags:
     *       - Dispositivi
     *     summary: Cancella un dispositivo.
     *     parameters:
     *       - name: id_dispositivo
     *         in: path
     *         required: true
     *         description: L'ID del dispositivo.
     *     responses:
     *       '200':
     *         description: Il dispositivo richiesto non esiste più.
     *       '400':
     *         description: L'ID inserito è invalido.
     */
    app.delete("/dispositivi/:id", async (req, res) => {
      let id;
      try {
        id = MongoDB.ObjectId(req.params.id);
      } catch(exc) {
        res.status(400).json({ errore: "ID del dispositivo invalido."});
        return;
      }

      const db = client.db(DATABASE);
      db.collection('dispositivo').deleteOne({ "_id": id })
        .then(results => res.json(results))
        .catch(err => res.send(err));
    });

    /**
     * @openapi
     * /proprieta:
     *   get:
     *     tags:
     *       - Proprietà
     *     summary: Restituisce una lista di proprietà.
     *     responses:
     *       '200':
     *         description: Un Array JSON di proprietà.
     */
    app.get('/proprieta', async (req, res) => {
      const db = client.db(DATABASE);
      const cursor = db.collection('proprietà').find();
      cursor.toArray().then(results => res.json(results));
    });

    /**
     * @openapi
     * /proprieta/{id_proprietà}/stanze:
     *   get:
     *     tags:
     *       - Proprietà
     *     summary: Restituisce una lista di stanze all'interno della proprietà.
     *     parameters:
     *       - name: id_proprietà
     *         in: path
     *         required: true
     *         description: L'ID della proprietà.
     *     description: |
     *       Restituisce una lista di stanze all'interno della proprietà.
     *     responses:
     *       '200':
     *         description: Un array di stanze all'interno della proprietà.
     *       '404':
     *         description: Nessuna proprietà con quell'ID è stato trovata.
     *       '400':
     *         description: L'ID inserito è invalido.
     */
    app.get("/proprieta/:id/stanze", async (req, res) => {
      let id;
      try {
        id = MongoDB.ObjectId(req.params.id);
      } catch(exc) {
        res.status(400).json({ errore: "ID della proprietà invalido."});
        return;
      }
      if(!(await exists("proprietà", id))) {
        res.status(404).json({ errore: "La proprietà non esiste." });
        return;
      }

      const db = client.db(DATABASE);
      db.collection('stanza').find({  // Cerca le stanze dentro la proprietà
        "Proprieta": id,
      })
        .toArray()
        .then(results => res.json(results))
        .catch(err => res.send(err));
    });

    /**
     * @openapi
     * /proprieta/{id_proprietà}/consumo:
     *   get:
     *     tags:
     *       - Proprietà
     *     summary: Restituisce i kWh consumati in un periodo di tempo da una proprietà.
     *     parameters:
     *       - name: id_proprietà
     *         in: path
     *         required: true
     *         description: L'ID della proprietà.
     *     description: |
     *       Restituisce i kWh consumati da tutti i dispositivi in una proprietà in un periodo di tempo. Si possono anche specificare la data di inizio e di fine nel body della richiesta.
     *       ```json
     *       {
     *         "dateStart": "YYYY-MM-DD",
     *         "dateEnd": "YYYY-MM-DD"
     *       }
     *       ```
     *       Entrambi gli attributi sono opzionali, e vengono ignorati se i dati inseriti non sono sintatticamente corretti.
     *     responses:
     *       '200':
     *         description: Il consumo in kWh dei dispositivi nella proprietà.
     *       '404':
     *         description: "Nessuna proprietà con quell'ID è stato trovata."
     *       '400':
     *         description: L'ID inserito è invalido.
     */
    app.get("/proprieta/:id/consumo", async (req, res) => {
      let id;
      try {
        id = MongoDB.ObjectId(req.params.id);
      } catch(exc) {
        res.status(400).json({ errore: "ID della proprietà invalido."});
        return;
      }
      if(!(await exists("proprietà", id))) {
        res.status(404).json({ errore: "La proprietà non esiste." });
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

    /**
     * @openapi
     * /stanze:
     *   get:
     *     tags:
     *       - Stanze
     *     summary: Restituisce una lista di stanze.
     *     responses:
     *       '200':
     *         description: Un Array JSON di stanze.
     */
    app.get('/stanze', async (req, res) => {
      const db = client.db(DATABASE);
      const cursor = db.collection('stanza').find();
      cursor.toArray().then(async results => {
        for(let i = 0; i < results.length; i++)
          results[i] = await expandStanza(results[i])
        res.json(results);
      });
    });

    /**
     * @openapi
     * /stanze/{id_stanza}/consumo:
     *   get:
     *     tags:
     *       - Stanze
     *     summary: Restituisce i kWh consumati in un periodo di tempo da una stanza.
     *     parameters:
     *       - name: id_stanza
     *         in: path
     *         required: true
     *         description: L'ID della stanza.
     *     description: |
     *       Restituisce i kWh consumati da tutti i dispositivi in una stanza in un periodo di tempo. Si possono anche specificare la data di inizio e di fine nel body della richiesta.
     *       ```json
     *       {
     *         "dateStart": "YYYY-MM-DD",
     *         "dateEnd": "YYYY-MM-DD"
     *       }
     *       ```
     *       Entrambi gli attributi sono opzionali, e vengono ignorati se i dati inseriti non sono sintatticamente corretti.
     *     responses:
     *       '200':
     *         description: Il consumo in kWh dei dispositivi nella stanza.
     *       '404':
     *         description: Nessuna stanza con quell'ID è stata trovata.
     *       '400':
     *         description: L'ID inserito è invalido.
     */
    app.get("/stanze/:id/consumo", async (req, res) => {
      let id;
      try {
        id = MongoDB.ObjectId(req.params.id);
      } catch(exc) {
        res.status(400).json({ errore: "ID della stanza invalido."});
        return;
      }
      if(!(await exists("stanza", id))) {
        res.status(404).json({ errore: "La stanza non esiste." });
        return;
      }

      let { datetimeStart, datetimeEnd } = req.body;

      const db = client.db(DATABASE);
      db.collection('dispositivo').find({
        "Locazione.tipo": "stanza",
        "Locazione.id": id,
      }).toArray()
        .then(results => {
          return db.collection("consumi").find({
            "DispositivoId": {
              $in: results.map(dispositivo => MongoDB.ObjectId(dispositivo._id)),
            },
            "Date": { $gte: datetimeStart, $lt: datetimeEnd },
          }).toArray();
        })
        .then(calculateResults(res))
        .catch(err => res.send(err));
    });

    /**
     * @openapi
     * /utenti/{email_utente}/consumo:
     *   get:
     *     tags:
     *       - Utenti
     *     summary: Restituisce i kWh consumati in un periodo di tempo da un utente.
     *     parameters:
     *       - name: email_utente
     *         in: path
     *         required: true
     *         description: L'email del'utente.
     *     description: |
     *       Restituisce i kWh consumati da tutti i dispositivi appartenenti ad un utente. Si possono anche specificare la data di inizio e di fine nel body della richiesta.
     *       ```json
     *       {
     *         "dateStart": "YYYY-MM-DD",
     *         "dateEnd": "YYYY-MM-DD"
     *       }
     *       ```
     *       Entrambi gli attributi sono opzionali, e vengono ignorati se i dati inseriti non sono sintatticamente corretti.
     *     responses:
     *       '200':
     *         description: Il consumo in kWh dei dispositivi dell'utente.
     *       '400':
     *         description: L'email inserita è invalida.
     */
    app.get("/utenti/:email/consumo", async (req, res) => {
      const { email } = req.params;
      const { datetimeStart, datetimeEnd } = req.body;

      const db = client.db(DATABASE);
      db.collection('proprietà').find({
        "Utente": email,
      })
        .toArray()
        .then(proprieta => proprieta.map(p => MongoDB.ObjectId(p._id)))
        .then(idProprieta => {
          db.collection("stanza").find({
            "Proprieta": { $in: idProprieta }
          }).toArray()
            .then(stanze => {
              return db.collection("dispositivo").find({
                $or: [
                  {
                    "Locazione.tipo": "stanza",
                    "Locazione.id": { $in: stanze.map(s => MongoDB.ObjectId(s._id)) }
                  },
                  {
                    "Locazione.tipo": "proprietà",
                    "Locazione.id": { $in: idProprieta }
                  }
                ]
              }).toArray();
            })
            .then(dispositivi => {
              return db.collection("consumi").find({
                "DispositivoId": { $in: dispositivi.map(d => MongoDB.ObjectId(d._id)) }
              }).toArray()
            })
            .then(calculateResults(res))
            .catch(errore => res.status(400).json({ errore }))
        })
        .catch(errore => res.status(400).json({ errore }));
    });

    /**
     * @openapi
     * /trigger:
     *   get:
     *     tags:
     *       - Trigger
     *     summary: Restituisce una lista di trigger.
     *     responses:
     *       '200':
     *         description: Un Array JSON di trigger.
     */
    app.get("/trigger", async (req, res) => {
      const db = client.db(DATABASE);
      const cursor = db.collection('trigger').aggregate([
        {
          $lookup: {
            from: "dispositivo",
            localField: "Dispositivo",
            foreignField: "_id",
            as: "Dispositivo",
          }
        },
        {
          $project: {
            Soglia: 1,
            NomeTrigger: 1,
            Dispositivo: { $arrayElemAt: [ "$Dispositivo", 0 ] }
          }
        }
      ]);
      cursor.toArray().then(async results => {
        for(let i = 0; i < results.length; i++) {
          results[i] = {
            ...results[i], Dispositivo: await expandDispositivo(results[i].Dispositivo)
          }
        }
        res.json(results);
      });
    });

    /**
     * @openapi
     * /trigger/{id_trigger}:
     *   get:
     *     tags:
     *       - Trigger
     *     summary: Restituisce un trigger.
     *     parameters:
     *       - name: id_trigger
     *         in: path
     *         required: true
     *         description: L'ID del trigger.
     *     responses:
     *       '200':
     *         description: Un trigger.
     *       '404':
     *         description: "`null`: Nessun trigger con quell'ID è stato trovato."
     *       '400':
     *         description: L'ID inserito è invalido.
     */
    app.get("/trigger/:id", async (req, res) => {
      let id;
      try {
        id = MongoDB.ObjectId(req.params.id);
      } catch(exc) {
        res.status(400).json({ errore: "ID del trigger invalido." });
        return;
      }

      const db = client.db(DATABASE);
      const cursor = db.collection('trigger').aggregate([
        { $match: { _id: id } },
        { $limit: 1 },
        {
          $lookup: {
            from: "dispositivo",
            localField: "Dispositivo",
            foreignField: "_id",
            as: "Dispositivo",
          }
        },
        {
          $project: {
            Soglia: 1,
            NomeTrigger: 1,
            Dispositivo: { $arrayElemAt: [ "$Dispositivo", 0 ] }
          }
        }
      ]);

      cursor.next()
        .then(async result => ({ ...result, Dispositivo: await expandDispositivo(result.Dispositivo) }))
        .then(result => res.status(result ? 200 : 404).json(result))
        .catch(err => res.status(500).json(err));
    });

    /**
     * @openapi
     * /trigger:
     *   post:
     *     tags:
     *       - Trigger
     *     summary: Aggiunge un trigger.
     *     description: |
     *       Aggiunge un trigger con i dati passati. Il body della richiesta deve contenere un JSON come segue:
     *       ```json
     *       {
     *         "Dispositivo": "string"
     *         "Soglia": "float",
     *         "NomeTrigger": "string"
     *       }
     *       ```
     *     responses:
     *       '201':
     *         description: Il trigger è stato aggiunto.
     *       '400':
     *         description: I dati inseriti non sono corretti.
     */
    app.post("/trigger", async (req, res) => {
      const db = client.db(DATABASE);
      const collection = db.collection('trigger');

      let error = await validateBody(req.body, "trigger");
      if(error) {
        res.status(400).json({ error });
        return;
      }
      const trigger = {
        ...req.body,
        Dispositivo: MongoDB.ObjectId(req.body.Dispositivo),
      };

      collection.insertOne(trigger)
        .then(result => {
          res.status(201).send(result)
        })
        .catch(error => res.status(500).send({ error }));
    });

    /**
     * @openapi
     * /trigger/{id_trigger}:
     *   put:
     *     tags:
     *       - Trigger
     *     summary: Modifica un trigger.
     *     parameters:
     *       - name: id_trigger
     *         in: path
     *         required: true
     *         description: L'ID del trigger.
     *     description: |
     *       Modifica i dati passati. Il body della richiesta deve contenere un JSON come segue:
     *       ```json
     *       {
     *         "Dispositivo": "string"
     *         "Soglia": "float",
     *         "NomeTrigger": "string"
     *       }
     *       ```
     *     responses:
     *       '200':
     *         description: Il trigger è stato modificato.
     *       '400':
     *         description: L'ID inserito è invalido o non sono corretti i dati.
     *       '404':
     *         description: Il trigger non esiste.
     */
    app.put("/trigger/:id", async (req, res) => {
      let id;
      try {
        id = MongoDB.ObjectId(req.params.id);
      } catch(exc) {
        res.status(400).json({ errore: "ID del dispositivo invalido."});
        return;
      }
      if(!(await exists("trigger", id))) {
        res.status(404).json({ errore: "Il trigger non esiste." });
        return;
      }

      let error = await validateBody(req.body, "trigger");
      if(error) {
        res.status(400).json({ error });
        return;
      }
      const trigger = {
        ...req.body,
        Dispositivo: MongoDB.ObjectId(req.body.Dispositivo),
      };

      const db = client.db(DATABASE);
      db.collection('trigger').updateOne({ _id: id }, { $set: trigger })
        .then(result => {
          res.send(result)
        })
        .catch(error => { console.error(error); res.status(500).send(error) });
    });

    /**
     * @openapi
     * /trigger/{id_trigger}:
     *   delete:
     *     tags:
     *       - Trigger
     *     summary: Cancella un trigger.
     *     parameters:
     *       - name: id_trigger
     *         in: path
     *         required: true
     *         description: L'ID del trigger.
     *     responses:
     *       '200':
     *         description: Il trigger richiesto non esiste più.
     *       '400':
     *         description: L'ID inserito è invalido.
     */
    app.delete("/trigger/:id", async (req, res) => {
      let id;
      try {
        id = MongoDB.ObjectId(req.params.id);
      } catch(exc) {
        res.status(400).json({ errore: "ID del dispositivo invalido."});
        return;
      }

      const db = client.db(DATABASE);
      db.collection('trigger').deleteOne({ "_id": id })
        .then(results => res.json(results))
        .catch(err => res.send(err));
    });
});

module.exports = app;
