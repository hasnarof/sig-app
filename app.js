import { coordinates } from "./resources/js/coordinates";

var $ = require("jquery");

var map = L.map("map").setView([-7.257471, 112.752088], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// Control 2: This add a scale to the map
L.control.scale().addTo(map);

// Control 3: This add a Search bar
var searchControl = new L.esri.Controls.Geosearch().addTo(map);

var results = new L.LayerGroup().addTo(map);

searchControl.on("results", function (data) {
  results.clearLayers();
  for (var i = data.results.length - 1; i >= 0; i--) {
    results.addLayer(L.marker(data.results[i].latlng));
  }
});

let markers = [];

let blueMarkerIcon = L.divIcon({ className: "blue-marker" });
let greenMarkerIcon = L.divIcon({ className: "green-marker" });

if (!localStorage.coordinates) {
  localStorage.setItem("coordinates", JSON.stringify(coordinates));
}

let storageCoordinates = JSON.parse(localStorage.getItem("coordinates"));
let count = 0
storageCoordinates.forEach((coordinate) => {
  if (coordinate.visited) {
    $(`#list-visited-house`)
      .append(`<li class="list-group-item d-flex justify-content-between">
      <span>${coordinate.address}, ${coordinate.kec_desa}</span>
      <button id="btn-focus-${coordinate.id}" class="btn btn-primary">Focus</button>
    </li>`);

    count++

    $(`#btn-focus-${coordinate.id}`).click(() => {
      map.flyTo([coordinate.lat, coordinate.lng], 18);
    });
  }
});
$(`#text-visited-house`).text(count)


storageCoordinates.forEach((point, i) => {
  markers[point.id] = L.marker(point, {
    icon: point.visited ? greenMarkerIcon : blueMarkerIcon,
  }).addTo(map);
  var popup = markers[point.id]
    .bindPopup(
      `<p>${point.address}, ${point.kec_desa}</p>
    <button id="btn-${point.id}" "type="button" class="btn ${
        point.visited ? "btn-warning" : "btn-primary"
      }">${point.visited ? "Unvisit" : "Visit"}</button>`
    )
    .addTo(map);

  markers[point.id].on("click", function (e) {
    popup.openPopup();

    // if visit button clicked, change the state to visited/visited and update the localstorage
    $(`#btn-${point.id}`).on("click", function () {
      let storageCoordinates = localStorage.getItem("coordinates");
      let parsedCoordinates = JSON.parse(storageCoordinates);
      parsedCoordinates[point.id].visited =
        !parsedCoordinates[point.id].visited;
      localStorage.setItem("coordinates", JSON.stringify(parsedCoordinates));

      let visitedCoordinates = parsedCoordinates.filter(
        (e) => e.visited == true
      );
      $(`#list-visited-house`).empty();
      visitedCoordinates.forEach((e) => {
        $(`#list-visited-house`)
          .append(`<li class="list-group-item d-flex justify-content-between">
          <span>${e.address}, ${e.kec_desa}</span>
          <button id="btn-focus-${e.id}" class="btn btn-primary">Focus</button>
        </li>`);

        $(`#text-visited-house`).text(visitedCoordinates.length);

        $(`#btn-focus-${e.id}`).click(() => {
          map.flyTo([e.lat, e.lng], 18);
        });
      });

      e.target.setIcon(
        parsedCoordinates[point.id].visited ? greenMarkerIcon : blueMarkerIcon
      );

      e.target.closePopup();
      markers[point.id]._popup.setContent(
        `<p>${point.address}, ${point.kec_desa}</p>
        <button id="btn-${point.id}" "type="button" class="btn ${
          parsedCoordinates[point.id].visited ? "btn-warning" : "btn-primary"
        }">${
          parsedCoordinates[point.id].visited ? "Unvisit" : "Visit"
        }</button>`
      );
    });
  });
});

$(document).ready(function () {
  $("#focus-surabaya").click(function () {
    map.flyTo([-7.257471, 112.752088], 13);
  });
})