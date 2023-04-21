import React, { useEffect } from 'react';
import '../Style/Maps.css';

export default function Maps() {
  useEffect(() => {
    // Chargez la bibliothèque Google Maps de manière asynchrone
    function loadScript(url, callback) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = url;
      script.async = true;
      script.defer = true;
      script.onload = callback;
      document.body.appendChild(script);
    }

    // Définir la fonction initMap dans la portée globale et la lier à l'objet window
    window.initMap = function () {
      const map = new window.google.maps.Map(document.getElementById("map"), {
        zoom: 2,
        center: { lat: 0, lng: 0 },
      });

      const origin = document.getElementById("origin").value;
      const destination = document.getElementById("destination").value;

      const waypointsInput = document.getElementById("waypoints").value;
      const waypoints = waypointsInput ? waypointsInput.split(",") : [];

      document.getElementById("panel").innerHTML = "";

      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        draggable: true,
        map,
        panel: document.getElementById("panel"),
      });

      directionsRenderer.addListener("directions_changed", () => {
        const directions = directionsRenderer.getDirections();

        if (directions) {
          computeTotalDistance(directions);
        }
      });
      displayRoute(
        origin,
        destination,
        waypoints,
        directionsService,
        directionsRenderer
      );
    }

    // Chargez la bibliothèque Google Maps et appelez la fonction initMap dans le gestionnaire de rappel
    loadScript(`https://maps.googleapis.com/maps/api/js?key=AIzaSyCQ2a_MKCta3uDFQh4AXDQAv3Z9OnFmhXE&callback=initMap&v=weekly`, () => {
      // Appelez la fonction initMap pour initialiser la carte
      window.initMap();
    });
  }, []);

  function displayRoute(origin, destination, waypoints, service, display) {
    service
      .route({
        origin: origin,
        destination: destination,
        waypoints: waypoints.map((waypoint) => {
          return { location: waypoint.trim() };
        }),
        travelMode: window.google.maps.TravelMode.DRIVING,
        avoidTolls: true,
      })
      .then((result) => {
        display.setDirections(result);
      })
      .catch((e) => {
        alert("Could not display directions due to: " + e);
      });
  }

  function computeTotalDistance(result) {
    let total = 0;
    const myroute = result.routes[0];

    if (!myroute) {
      return;
    }

    for (let i = 0; i < myroute.legs.length; i++) {
      total += myroute.legs[i].distance.value;
    }

    total = total / 1000;
    document.getElementById("total").innerHTML = total + " km";
  }

  return (
    <div id="container">
      <div id="map"></div>
      <div id="sidebar">
        <label htmlFor="origin">Origin:</label>
        <input type="text" id="origin" placeholder="Enter origin city" defaultValue="Perth, WA" />
        <label htmlFor="destination">Destination:</label>
        <input type="text" id="destination" placeholder="Enter destination city" defaultValue="Sydney, NSW" />

        <button onClick={() => window.initMap()}>Send</button>

        <label htmlFor="waypoints">Waypoints:</label>
        <input type="text" id="waypoints" placeholder="Enter waypoints" />

        <button onClick={() => window.initMap()}>Send</button>

        <p>Total Distance: <span id="total"></span></p>
        <div id="panel"></div>
      </div>
    </div>
  );
};    
