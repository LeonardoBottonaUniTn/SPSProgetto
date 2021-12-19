
const BASE_URL = "http://51.158.66.81:49146";

function getTriggers() {
  fetch(`${BASE_URL}/trigger`, {
    method: "GET",
    mode: "cors"
  })
  .then(response => response.json())
  .then(addTriggersCard);
}

function getDispositivi() {
  fetch(`${BASE_URL}/dispositivi`, {
    method: "GET",
    mode: "cors",
  })
  .then(response => response.json())
  .then(addDispositiviCard);
}
