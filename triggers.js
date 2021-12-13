


//eliminaTrigger()

// Azioni dei bottoni trigger
var btnID = document.getElementById('eliminaTriggerButton');
var btnModalID = document.getElementById('eliminaTrigger');
console.log(btnID);
console.log(btnModalID);
let card;

btnID.addEventListener('click', (event) => {
    console.log(event.target.id);
    if(event.target.id == btnID.id) {
        const button = event.target;
        card = button.parentNode.parentNode.parentNode.parentNode;
    }
});
console.log(card);

btnModalID.addEventListener('click', (event) => {
    console.log(event.target.id);
        if(event.target.id == btnModalID.id) {
            card.remove();
        }
});



//creaTrigger
addBtn = document.getElementById('saveNewtrigger');
let nomeDispositivo;
let livelloSoglia;
let iterator = 1;




addBtn.addEventListener('click', addNewTrigger);

function addNewTrigger(){
    
    nomeDispositivo = document.getElementById("nuovoTriggerDispositivo").value;
    livelloSoglia = document.getElementById("nuovoTriggerSoglia").value;
    
    let newTriggerCard = '<div class="col">' +
                            '<div class="card  mb-5 bg-body rounded" style="width:18rem">' +
                                '<div class="card-body">' +
                                    '<h5 class="card-title"> Trigger ' + iterator++ + '</h5>' +
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
