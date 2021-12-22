const BASE_URL = "http://51.158.66.81:49146";

//TRIGGERS
//get da server e riempie la pagina con i dispositivi
function getTriggers() {
  fetch(`${BASE_URL}/trigger`, {
    method: "GET",
    mode: "cors"
  })
  .then(response => response.json())
  .then(addTriggersCard);
}

//delete del trigger dal server
function deleteTrigger(id){
  fetch(`${BASE_URL}/trigger/`+ id, {
    method : "DELETE",
    mode : "cors"
  })
    .then(response => console.log(response))
}

//dispositivi per il select
function getOptionsDispositivi() {
  fetch(`${BASE_URL}/dispositivi`, {
    method: "GET",
    mode: "cors",
  })
  .then(response => response.json())
  .then(addOptions);
}

//aggiungo un nuovo trigger
function postNewTrigger(nomeDispositivo, livelloSoglia, idDispositivo){
  fetch(`${BASE_URL}/trigger`, {
    method: "POST",
    mode: "cors",
    headers : {
      "Content-type" : 'application/json'
    },
    body : JSON.stringify({
      Dispositivo: idDispositivo,
      NomeTrigger : "Trigger " + nomeDispositivo,
      Soglia : parseFloat(livelloSoglia)
    })
  })
    .then((res) => res.json())
    .then((data) => createNewTrigger(data, livelloSoglia, nomeDispositivo))
}

//DISPOSITIVI
function getDispositivi() {
  fetch(`${BASE_URL}/dispositivi`, {
    method: "GET",
    mode: "cors",
  })
  .then(response => response.json())
  .then(addDispositiviCard);
}

//delete del dispositivo dal server
function deleteDispositivo(id){
  fetch(`${BASE_URL}/dispositivi/`+ id, {
    method : "DELETE",
    mode : "cors"
  })
    .then(response => console.log(response))
}



//STANZE PER DASHBOARD

//Get lista delle stanze
function getProprietà() {
  fetch(`${BASE_URL}/proprieta`, {
    method: "GET",
    mode: "cors"
  })
  .then(response => response.json())
  .then(response => {
    addDashboard(response);
    getListaStanze(response);
    getConsumiProprieta(response[0])
  })
}

function getListaStanze(proprietà) {
  fetch(`${BASE_URL}/proprieta/`+ proprietà[0]._id + `/stanze`, {
    method: "GET",
    mode: "cors"
  })
  .then(response => response.json())
  .then(addConsumiStanze)
  
}

function getConsumoStanza(id) {
  fetch(`${BASE_URL}/stanze/`+ id + `/consumo`, {
    method: "GET",
    mode: "cors"
  })
  .then(response => response.json())
  .then(function (response){
    document.getElementById(id + "_consumo").innerHTML = response.consumo;
  })
  
}

function getConsumiProprieta(proprieta) {
  fetch(`${BASE_URL}/proprieta/`+ proprieta._id + `/consumo`, {
    method: "GET",
    mode: "cors"
  })
  .then(response => response.json())
  .then(function (response){
    console.log(proprieta._id + "_consumoProprieta");
    console.log(document.getElementById(proprieta._id + "_consumoPropieta"));

    document.getElementById(proprieta._id + "_consumoPropieta").innerHTML = response.consumo;
  })
  
}