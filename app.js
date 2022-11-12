import { coordinates } from "./resources/js/coordinates";

var $ = require("jquery");

var map = L.map("map").setView([-7.257471, 112.752088], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

let testmarker = [];
var plainMarkerIcon = new L.icon({
  iconUrl: "./resources/icons/marker-plain.png",
});
var redMarkerIcon = new L.icon({
  iconUrl: "./resources/icons/marker-red.png",
});

var blueMarkerIcon = L.divIcon({className: 'blue-marker'});
var greenMarkerIcon = L.divIcon({className: 'green-marker'});

function markVisit(pointId) {
  console.log(pointId)
  }

coordinates.forEach((point, i) => {
  testmarker[point.id] = L.marker(point, {icon: blueMarkerIcon}).addTo(map);
  testmarker[point.id].on("click", function (e) {
    e.target.setIcon(greenMarkerIcon);

    e.target.bindPopup(
      `<p>${point.address}, ${point.kec_desa}</p>
      <button id="btn-${point.id}" "type="button" class="btn ${point.visited ? "btn-warning" : "btn-primary"}">${point.visited ? "Unvisit" : "Visit"}</button>`
    ).openPopup();

    $(`#btn-${point.id}`).on("click", function () {
      alert("test");
    })
  });
});

  



