import { coordinates } from "./resources/js/coordinates";

var map = L.map("map").setView([-7.257471, 112.752088], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// L.marker([-7.257471, 112.752088]).addTo(map);

coordinates.forEach((coordinate) => {
  console.log(coordinate);
  L.marker(coordinate).addTo(map);
});
