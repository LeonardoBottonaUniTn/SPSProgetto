let iterator = 0;
let icona;

//CASE PER LE ICONE
/*function scegliIcona(categoria){

    //const expr = 'Papayas';
    switch (categoria) {
        case 'Google Home':
            icona.innerHTML = <i class="fab fa-google"></i> + "Google Home";
            break;
        case 'Luce':
            icona.innerHTML = <i class="fas fa-lightbulb" style="color: Y; "></i> + " Luce";
            break;
        case 'Frigo':
            icona.innerHTML = <i class="far fa-snowflake"></i> + " Frigorifero";
            break;
        case 'Caldo':
            icona.innerHTML = <i class="fas fa-fire"></i> + " Calorifero";
            break;
        case 'Lavaggio':
            icona.innerHTML = <i class="fas fa-tshirt"></i> + "Lavatrice";
            break;
        default:
        console.log(`Sorry, non so che cazzo vuoi inserire`);
    }
};*/

let dispositivi = [
    {
        _id: "61b1c4ef3d370fa548dec35b",
        ConsumiDichiarati: 0.072,
        DispositivoName: "LampadinaLed1",
        Locazione: {
            tipo: "stanza",
            id: "61b1d34f3d370fa548dec37f"
        }
    },
    {
        _id: "61b1c7fa3d370fa548dec35d",
        ConsumiDichiarati: 0.072,
        DispositivoName: "LampadinaLed2",
        Locazione: {
            tipo: "stanza",
            id: "61b1d3ff3d370fa548dec380"
        }
    },
    {
        _id: "61b1c8bf3d370fa548dec35e",
        ConsumiDichiarati: 105.6,
        DispositivoName: "Scaldabagno",
        Locazione: {
            tipo: "stanza",
            id: "61b1d5683d370fa548dec386"
        }
    },
    {
        _id: "61b1caa93d370fa548dec361",
        ConsumiDichiarati: 36,
        DispositivoName: "StufaElettrica",
        Locazione: {
            tipo: "stanza",
            id: "61b1d5683d370fa548dec386"
        }
    },
    {
        _id: "61b1cae43d370fa548dec362",
        ConsumiDichiarati: 0.657,
        DispositivoName: "LavatriceA",
        Locazione: {
            tipo: "stanza",
            id: "61b1d53d3d370fa548dec385"
        }
    },
    {
        _id: "61b1d6e73d370fa548dec391",
        ConsumiDichiarati: 0.072,
        DispositivoName: "LampadinaLed3",
        Locazione: {
            tipo: "stanza",
            id: "61b1d3ff3d370fa548dec380"
        }
    },
    {
        _id: "61b1d7e93d370fa548dec393",
        ConsumiDichiarati: 0.0336,
        DispositivoName: "GoogleHome",
        Locazione: {
            tipo: "stanza",
            id: "61b1d3ff3d370fa548dec380"
        }
    },
    {
        _id: "61b1d99a3d370fa548dec394",
        ConsumiDichiarati: 0.84,
        DispositivoName: "Frigorifero",
        Locazione: {
            tipo: "stanza",
            id: "61b1d3ff3d370fa548dec380"
        }
    }
];


function addDispositiviCard(){  

    let numeroDispositivi = dispositivi.length;
    
    while(iterator < numeroDispositivi){
        let ExistingDispositivoCard =   '<div class="col" id="' + dispositivi[iterator]._id + '">'  +
                                            '<div class="card" href="#" style="width:18rem">' +
                                                '<div class="card-body">' +
                                                    icona +  //tipo dispositivo
                                                    '<h5 class="card-title">'+ dispositivi[iterator].DispositivoName + '</h5>' +
                                                    '<p class="card-text">' +
                                                        'Stanza: <br/>' +
                                                        'Proprietà:' +
                                                    '</p>' +
                                                    '<div class="container">' +
                                                        '<a href="#" onclick="modificaCard(\'' + dispositivi[iterator]._id + '\')" class="btn btn-outline-secondary btn-sm" style="margin-right: 80px;" data-bs-toggle="modal" data-bs-target="#modificaDispositivoModal">Modifica</a>' +
                                                        '<a href="#"  onclick="eliminaCard(\'' + dispositivi[iterator]._id + '\')" class="btn btn-outline-danger btn-sm " data-bs-toggle="modal" data-bs-target="#eliminaDispositivoModal"><i class="fas fa-trash-alt" style="color: black; width: 18px;"></i></a>' +
                                                    '</div>' +
                                                '</div>' +
                                            '</div>' +
                                        '</div>' ;

        document.getElementById("rowContainer").innerHTML += ExistingDispositivoCard;
        iterator++;
    }
};




//ELIMINA LA CARD DEL DISPOSITIVO

var btnModalID = document.getElementById('eliminaDispositivo');
//console.log(btnModalID.id);
let card;

function eliminaCard(id) {
    card = document.getElementById(id);
}

btnModalID.addEventListener('click', (event) => {
    console.log(event.target.id);
    if(event.target.id == btnModalID.id) {
    
        card.remove();
    }
});


//CREA NUOVO DISPOSITIVO

addBtn = document.getElementById('saveNewDispositivo');
let nomeDispositivo;
let stanzaDispositivoScelta;
let proprietàDispositivoScelta;

var stanzaDispositivo;
var proprietàDispositivo;

addBtn.addEventListener('click', addNewDispositivo);

function addNewDispositivo(){
    iterator = 0;
    nomeDispositivo = document.getElementById("nuovoNomeDispositivo").value;
    //console.log(nomeDispositivo);
    stanzaDispositivoScelta = document.getElementById("inputGroupSelect011");
    stanzaDispositivo = stanzaDispositivoScelta.options[stanzaDispositivoScelta.selectedIndex].text;
    //console.log(stanzaDispositivo);
    proprietàDispositivoScelta = document.getElementById("inputGroupSelect012");
    proprietàDispositivo = proprietàDispositivoScelta.options[proprietàDispositivoScelta.selectedIndex].text;
    //console.log(proprietàDispositivo);
    
    let newDispositivoCard =    '<div class="col" id="+">'  +    //manca il vuovo id generato
                                '<div class="card" href="#" style="width:18rem">' +
                                    '<div class="card-body">' +
                                        icona +  //tipo dispositivo
                                        '<h5 class="card-title"> ' + nomeDispositivo + '</h5>' +
                                        '<p class="card-text">' +
                                            'Stanza: ' + stanzaDispositivo + '<br/>' +
                                            'Proprietà: ' + proprietàDispositivo +
                                        '</p>' +
                                        '<div class="container">' +
                                            '<a href="#" onclick="eliminaCard( + dispositivi[iterator]._id + )" class="btn btn-outline-secondary btn-sm" style="margin-right: 80px;" data-bs-toggle="modal" data-bs-target="#modificaDispositivoModal">Modifica</a>' +
                                            '<a href="#"  onclick="eliminaCard( + dispositivi[iterator]._id +)" class="btn btn-outline-danger btn-sm " data-bs-toggle="modal" data-bs-target="#eliminaDispositivoModal"><i class="fas fa-trash-alt" style="color: black; width: 18px;"></i></a>' +  //manca l'id da generare
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' ;
    iterator++;
    //console.log(newDispositivoCard);
    document.getElementById("rowContainer").innerHTML += newDispositivoCard;
        
}; 



//modificaTrigger
modifyBtn = document.getElementById('modificaDispositivo');
modifyBtn.addEventListener('click', modifyDispositivo);
let i;
let cardId;

function modificaCard(id) {
    cardId = id;
    i = 0;
    console.log(cardId);
    while(cardId != dispositivi[i]._id){
        i++;
    }
    console.log(i);
}


function reloadDispositiviCard(){
    document.getElementById("rowContainer").innerHTML = '';
    iterator = 0;
    let numeroDispositivi = dispositivi.length;
    while(iterator < numeroDispositivi){  
        let ExistingDispositivoCard =   '<div class="col" id="' + dispositivi[iterator]._id + '">'  +
                                            '<div class="card" href="#" style="width:18rem">' +
                                                '<div class="card-body">' +
                                                    icona +  //tipo dispositivo
                                                    '<h5 class="card-title">'+ dispositivi[iterator].DispositivoName + '</h5>' +
                                                    '<p class="card-text">' +
                                                        'Stanza: <br/>' +
                                                        'Proprietà:' +
                                                    '</p>' +
                                                    '<div class="container">' +
                                                        '<a href="#" onclick="modificaCard(\'' + dispositivi[iterator]._id + '\')" class="btn btn-outline-secondary btn-sm" style="margin-right: 80px;" data-bs-toggle="modal" data-bs-target="#modificaDispositivoModal">Modifica</a>' +
                                                        '<a href="#"  onclick="eliminaCard(\'' + dispositivi[iterator]._id + '\')" class="btn btn-outline-danger btn-sm " data-bs-toggle="modal" data-bs-target="#eliminaDispositivoModal"><i class="fas fa-trash-alt" style="color: black; width: 18px;"></i></a>' +
                                                    '</div>' +
                                                '</div>' +
                                            '</div>' +
                                        '</div>' ;
        
        document.getElementById("rowContainer").innerHTML += ExistingDispositivoCard;
        iterator++;
    }
};

function modifyDispositivo(){

    //onsole.log("Entro in modifyDispositivo");
    let modificaTipoDispositivoScelta = document.getElementById("inputGroupSelect021");
    let modificaTipoDispositivo = modificaTipoDispositivoScelta.options[modificaTipoDispositivoScelta.selectedIndex].text;
    //console.log(modificaTipoDispositivo);
    let modificaNomeDispositivo = document.getElementById("modificaNomeDispositivo").value;
    //onsole.log(modificaNomeDispositivo);
    let modificaStanzaDispositivoScelta = document.getElementById("inputGroupSelect022");
    let modificaStanzaDispositivo = modificaStanzaDispositivoScelta.options[modificaStanzaDispositivoScelta.selectedIndex].text;
    //console.log(modificaStanzaDispositivo);
    let modificaProprietàDispositivoScelta = document.getElementById("inputGroupSelect023");
    let modificaProprietàDispositivo = modificaProprietàDispositivoScelta.options[modificaProprietàDispositivoScelta.selectedIndex].text;
    //console.log(modificaProprietàDispositivo);
    
    dispositivi[i].DispositivoName = modificaNomeDispositivo;
    //da finire in bare ai cambiamenti sul db
    
    reloadTriggersCard()
}
