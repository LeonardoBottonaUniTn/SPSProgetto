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
