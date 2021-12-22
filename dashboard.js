let iterator;

var  mese = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
var date = new Date();
var meseCorrente=mese[date.getMonth()];






function addDashboard(proprietà){
    console.log(proprietà[0]._id +'_consumoProprieta');
    let layoutPrincipale =  '<div class="container rounded-pill border" style="background-color: #F8F9FA; max-width: 300px;">' +
                                '<p class="h6" >' + meseCorrente + '&emsp;|&emsp;' + proprietà[0].NomeProprieta + '</p>' +
                            '</div>' +
                            '<div class="bg-color border" style="background-color: #F8F9FA; border-radius: 1ch; height: 150px; margin-top: 15px; margin-left: 0px; margin-right: 0px;">' +
                                
                                '<h4 class="display-6" style=" text-align: left; margin-left: 20px; margin-top: -5px;">' +
                                    'Consumo</br> ' +
                                    'mensile' +
                                    '<p class="h1" id="' + proprietà[0]._id +'_consumoProprieta" style=" text-align: right; text-align: end; margin-right: 60px; font-size: 50px; margin-bottom: 40px;">kW/H</p>' +
                                '</h4>' +
                            '</div>' +
                            '</div>' +
                                '<div class="container">' +
                                    '<div class="row " id="rowCardStanze">' +
                                        
                                    '</div>' +

                            '<div class="bg-color border" style="background-color: #F8F9FA; border-radius: 3px; height: 150px; margin-top: 15px; margin-left: 0px; margin-right: 0px;">' +
                                
                                '<h4 class="display-6" style=" text-align: left; margin-left: 20px; margin-top: -5px;">' +
                                    'Media</br>' +
                                    'mensile' +
                                    '<p class="h1" style=" text-align: right; text-align: end; margin-right: 60px; font-size: 50px; margin-bottom: 40px;">0.16 kW/H</p>' +
                                '</h4>'+
                            '</div>' + 
                            '</br>';

                            document.getElementById("containerDashboard").innerHTML = layoutPrincipale;
                            
}

function addConsumiStanze(stanze){
    let numeroStanze = stanze.length;
    iterator = 0;

    while(iterator < numeroStanze){
        
        getConsumoStanza(stanze[iterator]._id);
        let cardStanze = '<div class="col-md-6 " style="margin-right: 0%;">' +
                            '<div class="card text-center border" style="background-color: #F8F9FA; border: #F8F9FA; margin-top: 15px;">' +
                                    '<div class="card-body " style="background-color: #F8F9FA; border-color: #F8F9FA; border-radius: 3ch;">' +
                                        '<h2 class="card-title" id="' + stanze[iterator]._id +'_consumo">' + 
                                        '</h2>'+
                                        '<p class="card-text" >' + stanze[iterator].NomeStanza + '</p>' +
                                    '</div>' +
                                '</div>' +
                            '</div>';
                            
                            document.getElementById("rowCardStanze").innerHTML += cardStanze;
                            iterator++;
                        }
                        

}
