'use strict'

const API_URL = "https://opendata.brussels.be/api/explore/v2.1/catalog/datasets/parcs_et_jardins_publics/records?limit=20"


const map = L.map('map').setView([50.85, 4.35], 11);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map); //geeft de kaart achtergrond


async function loadLocations() {
    const response = await fetch(API_URL); 
    const data = await response.json();
    const results = data.results;

    const tbody = document.querySelector("#tabel tbody");
    tbody.innerHTML = "";

    results.foreach(park => {
        const tr = document.createElement("tr");

    tr.innerHTML =
        "<td>" + (park.nom_du_parc || "Geen naam") + "</td>" +
        "<td>" + (park.commune || "Onbekend") + "</td>" +
        "<td>" + (park.code_postal || "-") + "</td>" +
        "<td>" + (park.type || "-") + "</td>" +
        "<td>" + (
            park.superficie 
            ? park.superficie.toLocaleString() + " m²"
            : "-") // m² 
        "<td>" + (park.adresse || "-") + "</td>" +
        "<td>" + (
            park.geo_point_2d
            ? park.geo_point_2d.lat + ", " + park.geo_point_2d.lon
            : "-"
        ) + "</td>"; // for coördinaters
        tbody.appendChild(tr);

   
        if(park.geo_point_2d) {
        const lat = park.geo_point_2d.lat;
        const lon = park.geo_point_2d.lon;

        const marker = L.marker([lat, lon]);
        marker.addTo(map);

      marker.bindPopup(park.nom_du_parc);
    }
  });
}

loadLocations();