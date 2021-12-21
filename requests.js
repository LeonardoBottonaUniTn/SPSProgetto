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

//aggiungo un nuovo trigger
function postNewTrigger(nomeDispositivo, livelloSoglia){
  fetch(`${BASE_URL}/trigger`, {
    method: "POST",
    mode: "cors",
    headers : {
      "Content-type" : 'application/json'
    },
    body : JSON.stringify ({
      “Dispositivo”: “47acb75…”,
      “NomeTrigger”: “TriggerEsempio”,
      “Soglia”: 25
    })
    .then((res) => res.json())
    .then((data) => console.log(data))
  })

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