
console.log("ciao");

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
        card = button.parentNode.parentNode.parentNode;
    }
});
console.log(card);



btnModalID.addEventListener('click', (event) => {
    console.log(event.target.id);
        if(event.target.id == btnModalID.id) {
            card.remove();
        }
});

//eliminaTrigger()