import { coordinates } from "./resources/js/coordinates";

var $ = require("jquery");

var map = L.map("map").setView([-7.257471, 112.752088], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

let markers = [];

let blueMarkerIcon = L.divIcon({className: 'blue-marker'});
let greenMarkerIcon = L.divIcon({className: 'green-marker'});

if (!localStorage.coordinates) {
  localStorage.setItem("coordinates", JSON.stringify(coordinates));
}

let storageCoordinates = JSON.parse(localStorage.getItem("coordinates"));
storageCoordinates.forEach((coordinate) => {
  if(coordinate.visited) {
    $(`#list-visited-house`).append(`<li class="list-group-item">${coordinate.address}, ${coordinate.kec_desa}</li>`)
  }
})

coordinates.forEach((point, i) => {
  markers[point.id] = L.marker(point, {icon: blueMarkerIcon}).addTo(map);
  var popup = markers[point.id].bindPopup(
    `<p>${point.address}, ${point.kec_desa}</p>
    <button id="btn-${point.id}" "type="button" class="btn ${point.visited ? "btn-warning" : "btn-primary"}">${point.visited ? "Unvisit" : "Visit"}</button>`
  ).addTo(map);

  markers[point.id].on("click", function (e) {
    popup.openPopup();

    // if visit button clicked, change the state to visited/visited and update the localstorage
    $(`#btn-${point.id}`).on("click", function () {
      let storageCoordinates = localStorage.getItem("coordinates");
      let parsedCoordinates = JSON.parse(storageCoordinates);
      parsedCoordinates[point.id].visited = !parsedCoordinates[point.id].visited;
      localStorage.setItem("coordinates", JSON.stringify(parsedCoordinates));

      let visitedCoordinates = parsedCoordinates.filter((e) => e.visited == true)
      $(`#list-visited-house`).empty()
      visitedCoordinates.forEach(e => {
        $(`#list-visited-house`).append(`<li class="list-group-item">${e.address}, ${e.kec_desa}</li>`)
      })

      e.target.setIcon(parsedCoordinates[point.id].visited ? greenMarkerIcon : blueMarkerIcon);

      e.target.closePopup();
      markers[point.id]._popup.setContent(
        `<p>${point.address}, ${point.kec_desa}</p>
        <button id="btn-${point.id}" "type="button" class="btn ${parsedCoordinates[point.id].visited ? "btn-warning" : "btn-primary"}">${parsedCoordinates[point.id].visited ? "Unvisit" : "Visit"}</button>`
      )
    })
  });
});


