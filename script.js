"use strict";

const API_URL = "https://opendata.brussels.be/api/explore/v2.1/catalog/datasets/parcs_et_jardins_publics/records?limit=20";

const map = L.map("map").setView([50.85, 4.35], 11);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap"
}).addTo(map);

async function loadLocations() {
  const response = await fetch(API_URL);
  const data = await response.json();

  const results = data.results; 

  console.log(results[0]);

  const tbody = document.querySelector("#tbody");
  tbody.innerHTML = "";

  const bounds = []; 

  results.forEach(park => {
    const tr = document.createElement("tr");

    tr.innerHTML =
      "<td>" + (park.nom || "Geen naam") + "</td>" +
      "<td>" + (park.commune || "Onbekend") + "</td>" +
      "<td>" + (park.postalcode || "-") + "</td>" +
      "<td>" + (park.type || "-") + "</td>" +
      "<td>" +
        (park.surface
          ? park.surface.toLocaleString() + " m²"
          : "-") +
      "</td>" +
      "<td>" + (park.adresse || "-") + "</td>" +
      "<td>" +
        (park.geo_point_2d
          ? park.geo_point_2d.lat + ", " + park.geo_point_2d.lon
          : "-") +
      "</td>";

    tbody.appendChild(tr);

    
    if (park.geo_point_2d) {
      const lat = park.geo_point_2d.lat;
      const lon = park.geo_point_2d.lon;

      const marker = L.marker([lat, lon]).addTo(map);
      marker.bindPopup(park.nom || "Park");

      bounds.push([lat, lon]); 
    }
  });

  if (bounds.length > 0) {
    map.fitBounds(bounds);
  }
}

loadLocations();