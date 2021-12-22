# Smart Property System

| Componente del team | Ruolo |
| -  | - |
| Leonardo Bottona | Leader del progetto |
| Riccardo Sartori | Progettista |
| Gaia Pizzuti | Analista |

## API

Per descrizioni molto più dettagliate, [visitare la documentazione](http://51.158.66.81:49146/api-docs/) in Swagger oppure eseguire l'applicazione e leggerla [localmente](http://localhost:49146/api-docs/)

| Metodo | Endpoint | Descrizione |
| - | - | - |
| GET | `/dispositivi` | Restituisce una lista di dispositivi |
| GET | `/dispositivi/:id` | Restituisce un dispositivo |
| GET | `/dispositivi/:id/consumo` | Restituisce il consumo in kWh di un dispositivo |
| POST | `/dispositivi` | Aggiunge un dispositivo |
| PUT | `/dispositivi/:id` | Modifica un dispositivo |
| DELETE   | `/dispositivi/:id` | Elimina un dispositivo |
| GET | `/proprieta` | Restituisce una lista di proprietà |
| GET | `/proprieta/:id/stanze` | Restituisce una lista di stanze all'interno della proprietà |
| GET | `/proprieta/:id/consumo` | Restituisce il consumo in kWh di una proprietà |
| GET | `/stanze` | Restituisce una lista di stanze |
| GET | `/stanze/:id/cosnumo` | Restituisce il consumo in kWh di una stanza |
| GET | `/utenti/:email/cosnumo` | Restituisce il consumo in kWh di un utente |
| GET | `/trigger` | Restituisce una lista di trigger |
| GET | `/trigger/:id` | Restituisce un trigger |
| POST | `/trigger` | Aggiunge un trigger |
| PUT | `/trigger/:id` | Modifica un trigger |
| DELETE   | `/trigger/:id` | Elimina un trigger |

## Installazione

Una volta installato git, clonare la repository ed entrare nella cartella tramite linea di comando:
```bash
git clone https://github.com/LeonardoBottonaUniTn/SPSProgetto.git
cd SPSProgetto
```
Il server può essere avviato tramite il comando
```
npm start
```

L'applicazione frontend può essere raggiunta mettendo la cartella in una qualsiasi directory servita da un server Apache. Per cambiare l'URL a cui l'applicazione comunicherà per usare le API, cambiare la variabile `BASE_URL` in `requests.js:1`

### Errori
Nel caso dia errore in `SPSProgetto/node_modules/whatwg-url/lib/encoding.js:2`, aprire il file e digitare alla riga 2:
```js
const { TextEncoder, TextDecoder } = require("util");
```
