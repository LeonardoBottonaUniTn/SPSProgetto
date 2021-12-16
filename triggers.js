
let iterator = 0;


//Prende e stampa i trigger già esistenti

 var triggers = [
  {
    _id: "61b1e65c3d370fa548dec3a2",
    Dispositivo: {
      _id: "61b1c4ef3d370fa548dec35b",
      ConsumiDichiarati: 0.072,
      DispositivoName: "LampadinaLed1",
      Locazione: {
        tipo: "stanza",
        id: "61b1d34f3d370fa548dec37f"
      }
    },
    Soglia: 1
  },
  {
    _id: "61b1e70b3d370fa548dec3a4",
    Dispositivo: {
      _id: "61b1c8bf3d370fa548dec35e",
      ConsumiDichiarati: 0.072,
      DispositivoName: "LampadinaLed2",
      Locazione: {
        tipo: "stanza",
        id: "61b1d3ff3d370fa548dec380"
      }
    },
    Soglia: 130
  },
];


function addTriggersCard(){  

  let numeroTriggers = triggers.length;
  
  
  while(iterator <= numeroTriggers){
    let ExistingTriggerCard = '<div class="col" id="' + triggers[iterator]._id + '">' +
                      '<div class="card mb-5 bg-body rounded" style="width:18rem">' +
                          '<div class="card-body">' +
                              '<h5 class="card-title"> Trigger ' + triggers[iterator].Dispositivo.DispositivoName + '</h5>' +
                              '<p class="card-text">' +
                                  'Nome dispositivo : '+ triggers[iterator].Dispositivo.DispositivoName + '<br/>' +
                                  'Livello soglia : ' + triggers[iterator].Soglia + ' kW/h' +
                              '</p>' +
                              '<div class="container">' +
                                  '<a href="#" onclick="modificaCard(\'' + triggers[iterator]._id + '\')" class="btn btn-outline-secondary btn-sm" style="margin-right: 80px;" data-bs-toggle="modal" data-bs-target="#modificaTriggerModal">Modifica</a>' +
                                  '<a href="#eliminaTrigger" onclick="eliminaCard(\'' + triggers[iterator]._id + '\')" class="btn btn-outline-danger btn-sm" data-bs-toggle="modal" data-bs-target="#eliminaTrigger"><i class="fas fa-trash-alt" style="color: black; width: 18px;"></i></a>' +
                              '</div>' +
                          '</div>' +
                      '</div>' +
                  '</div>';

                  document.getElementById("rowContainer").innerHTML += ExistingTriggerCard;
                  iterator++;
  }
};



//eliminaTrigger()

// Azioni dei bottoni trigger
var btnModalID = document.getElementById('eliminaTrigger');
let card;

// btnID.addEventListener('click', (event) => {
//     console.log(event.target.id);
//     if(event.target.id == btnID.id) {
//         const button = event.target;
//         card = button.parentNode.parentNode.parentNode.parentNode;
//     }
// });

function eliminaCard(id) {
  card = document.getElementById(id);
}

btnModalID.addEventListener('click', (event) => {
    // console.log(event.target.id);
          if(event.target.id == btnModalID.id) {
            
            card.remove();
            
          }
});



//creaTrigger
addBtn = document.getElementById('saveNewtrigger');
let nomeDispositivo;
let livelloSoglia;

addBtn.addEventListener('click', addNewTrigger);

function addNewTrigger(){
  iterator = 0;
  nomeDispositivo = document.getElementById("nuovoTriggerDispositivo").value;
  livelloSoglia = document.getElementById("nuovoTriggerSoglia").value;
  
  let newTriggerCard = '<div class="col"> id="' +  /*idGeneratoInQualcheMdodo*/ +
                          '<div class="card mb-5 bg-body rounded" style="width:18rem">' +
                              '<div class="card-body">' +
                                '<h5 class="card-title"> Trigger ' + nomeDispositivo + '</h5>' +
                                '<p class="card-text">' +
                                'Nome dispositivo : '+ nomeDispositivo + '<br/>' +
                                'Livello soglia : ' + livelloSoglia +
                                '</p>' +
                              '<div class="container">' +
                              '<a href="#" onclick="modificaCard(\'' + /*idGeneratoInQualcheModo*/ + '\')" class="btn btn-outline-secondary btn-sm" style="margin-right: 80px;" data-bs-toggle="modal" data-bs-target="#modificaTriggerModal">Modifica</a>' +
                                  '<a href="#eliminaTrigger" onclick="eliminaCard(\'' /*idGeneratoInQualcheModo*/ + '\')" class="btn btn-outline-danger btn-sm" data-bs-toggle="modal" data-bs-target="#eliminaTrigger"><i class="fas fa-trash-alt" style="color: black; width: 18px;"></i></a>' +
                            '</div>' +
                          '</div>' +
                        '</div>' +
                      '</div>';
    iterator++;
    console.log(newTriggerCard);
    document.getElementById("rowContainer").innerHTML += newTriggerCard;
    
  }



//modificaTrigger
modifyBtn = document.getElementById('modificaTrigger');
modifyBtn.addEventListener('click', modifyTrigger);
let i;
let cardId;

function modificaCard(id) {
  cardId = id;
  i = 0;
  console.log(cardId);
  while(cardId != triggers[i]._id){
    i++;
  }
  console.log(i);
}


function reloadTriggersCard(){
  document.getElementById("rowContainer").innerHTML = '';
  iterator = 0;
  let numeroTriggers = triggers.length;
  while(iterator <= numeroTriggers){  
    let ExistingTriggerCard = '<div class="col" id="' + triggers[iterator]._id + '">' +
                                    '<div class="card mb-5 bg-body rounded" style="width:18rem">' +
                                      '<div class="card-body">' +
                                        '<h5 class="card-title"> Trigger ' + triggers[iterator].Dispositivo.DispositivoName + '</h5>' +
                                        '<p class="card-text">' +
                                          'Nome dispositivo : '+ triggers[iterator].Dispositivo.DispositivoName + '<br/>' +
                                          'Livello soglia : ' + triggers[iterator].Soglia + ' kW/h' +
                                        '</p>' +
                                        '<div class="container">' +
                                          '<a href="#" onclick="modificaCard(\'' + triggers[iterator]._id + '\')" class="btn btn-outline-secondary btn-sm" style="margin-right: 80px;" data-bs-toggle="modal" data-bs-target="#modificaTriggerModal">Modifica</a>' +
                                          '<a href="#eliminaTrigger" onclick="eliminaCard(\'' + triggers[iterator]._id + '\')" class="btn btn-outline-danger btn-sm" data-bs-toggle="modal" data-bs-target="#eliminaTrigger"><i class="fas fa-trash-alt" style="color: black; width: 18px;"></i></a>' +
                                        '</div>' +
                                      '</div>' +
                                  '</div>' +
                                '</div>';
    
    document.getElementById("rowContainer").innerHTML += ExistingTriggerCard;
    iterator++;
  }
};

function modifyTrigger(){
  
  console.log(document.getElementById("modificaNomeDispositivo").value);
  console.log(document.getElementById("modificaLivelloSoglia").value);
  let modificaNomeDispositivo = document.getElementById("modificaNomeDispositivo").value;
  let modificaSoglia = document.getElementById("modificaLivelloSoglia").value;
  triggers[i].Dispositivo.DispositivoName = modificaNomeDispositivo;
  triggers[i].Soglia =  modificaSoglia;
  reloadTriggersCard()
}



