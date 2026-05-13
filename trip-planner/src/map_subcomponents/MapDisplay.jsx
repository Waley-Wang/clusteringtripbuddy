/*
 * File to handle the map view of the program. This should display the attractions the user has put
 * in the program. This should also allow them to add and delete by clicking.
 */
import React from 'react';
import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from "react-leaflet";
import L from 'leaflet';

import './Map.css';

// Fix default marker icon issue in Vite + Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const customIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // your custom image URL
  iconSize: [38, 38], // size of the icon
  iconAnchor: [19, 38], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -38], // point from which the popup should open relative to the iconAnchor
  shadowUrl: iconShadow,
  shadowSize: [41, 41],
  shadowAnchor: [13, 41],
});

function ClickHandler({ onClick }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng); // Pass clicked coordinates to parent
    },
  });
  return null;
}

export default function MapDisplay({markers, setMarkers, knownLocations, setKnownLocations}) {
  const handleAddMarker = (latlng) => {
    fetch('https://random-word-api.herokuapp.com/word')
                .then(response => response.json())
                .then(json_data => {
                    let text = json_data[0];
                    text = text.charAt(0).toUpperCase() + text.slice(1);
                    setMarkers((prev) => [...prev, {...latlng, name : text}]);
                });
  };

  const position = [38.8951, -77.0364]; // Example: Washington, DC
  return (
    <div id="mapviewcontainer">
        <MapContainer
        id = "mapview"
        center={position}
        zoom={13}
        >
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ClickHandler onClick={(latlng) => 
            handleAddMarker(latlng)} />
        
        {markers.map((pos, idx) => (
            <Marker key={idx} position={pos}>
            <Popup>
                {(pos.name)? pos.name : `Attraction ${idx + 1}`}
            </Popup>
            </Marker>
        ))}

        {knownLocations.map((pos, idx) => (
            <Marker key={idx} position={pos} icon={customIcon}>
              <Popup>
                {(pos.name)? pos.name : `Unnamed Attraction `}
                <button onClick={
                    () => {
                        setMarkers((prev) => [...prev, pos]);
                        setKnownLocations(knownLocations.filter((_, i) => i !== idx))

                    }
                }>
                  Add?
                </button>
              </Popup>
            </Marker>
        ))}
        </MapContainer>
    </div>
  );
}
