const { application } = require("express");

const logo = document.createElement('img');
logo.setAttribute = ('class', 'foto');
logo.src = 'Logo/Logo5.jpg';

app.appendChild(logo);

//MODALS
var myModal = document.getElementById('myModal')
var myInput = document.getElementById('myInput')

myModal.addEventListener('shown.bs.modal', function () {
    myInput.focus()
})