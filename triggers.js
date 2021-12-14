let culetto = 1;
let cristo = 1;


//Prende e stampa i trigger già esistenti

let triggers = [
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
  }
];


function addTriggersCard(){  
  console.log("ciao");
  let numeroTriggers = triggers.length();
  
  while(cristo <= numeroTriggers){
    let ExistingTriggerCard = '<div class="col">' + triggers[cristo].id +
                      '<div class="card mb-5 bg-body rounded" style="width:18rem">' +
                          '<div class="card-body">' +
                              '<h5 class="card-title"> Trigger ' + cristo++ + '</h5>' +
                              '<p class="card-text">' +
                                  'Nome dispositivo : '+ triggers[cristo].DispositivoName + '<br/>' +
                                  'Livello soglia :' + triggers[cristo].Soglia +
                              '</p>' +
                              '<div class="container">' +
                                  '<a href="#" class="btn btn-outline-secondary btn-sm" style="margin-right: 80px;" data-bs-toggle="modal" data-bs-target="#modificaTrigger">Modifica</a>' +
                                  '<a href="#eliminaTrigger" onclick="eliminaCard(' + triggers[cristo].id + 'class="btn btn-outline-danger btn-sm" data-bs-toggle="modal" data-bs-target="#eliminaTrigger"><i class="fas fa-trash-alt" style="color: black; width: 18px;"></i></a>' +
                              '</div>' +
                          '</div>' +
                      '</div>' +
                  '</div>';

      document.getElementById("rowContainer").innerHTML += ExistingTriggerCard;
  }
};



//eliminaTrigger()

// Azioni dei bottoni trigger
var btnID = document.getElementById('eliminaTriggerButton');
var btnModalID = document.getElementById('eliminaTrigger');
console.log(btnID);
console.log(btnModalID);
let card;

// btnID.addEventListener('click', (event) => {
//     console.log(event.target.id);
//     if(event.target.id == btnID.id) {
//         const button = event.target;
//         card = button.parentNode.parentNode.parentNode.parentNode;
//     }
// });

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

function eliminaCard(id) {
  card = document.getElementById(id);
}

function addNewTrigger(){

    nomeDispositivo = document.getElementById("nuovoTriggerDispositivo").value;
    livelloSoglia = document.getElementById("nuovoTriggerSoglia").value;

    let newTriggerCard = '<div class="col">' +
                    '<div class="card mb-5 bg-body rounded" style="width:18rem">' +
                        '<div class="card-body">' +
                            '<h5 class="card-title"> Trigger ' + cristo++ + '</h5>' +
                            '<p class="card-text">' +
                                'Nome dispositivo : '+ nomeDispositivo + '<br/>' +
                                'Livello soglia :' + livelloSoglia +
                            '</p>' +
                            '<div class="container">' +
                                '<a href="#" class="btn btn-outline-secondary btn-sm" style="margin-right: 80px;" data-bs-toggle="modal" data-bs-target="#modificaTrigger">Modifica</a>' +
                                '<a href="#eliminaTrigger" id="eliminaTriggerButton" class="btn btn-outline-danger btn-sm" data-bs-toggle="modal" data-bs-target="#eliminaTrigger"><i class="fas fa-trash-alt" style="color: black; width: 18px;"></i></a>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>';

    document.getElementById("rowContainer").innerHTML += newTriggerCard;
    
    //var n = document.createTextNode(newTriggerCard);
    //document.getElementById("rowContainer").appendChild(n);
}





