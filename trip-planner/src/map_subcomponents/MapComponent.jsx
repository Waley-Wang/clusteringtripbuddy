import React from 'react';
import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from "react-leaflet";
import L from 'leaflet';
import MapDisplay from './MapDisplay';
import PointList from './PointList';
import ClusterForm from './ClusterForm';

import './Map.css';
import './Forms.css';

const API_URL = import.meta.env.VITE_API_URL;

let knownLocations = await fetch(API_URL + '/locations').then((response) =>response.json());
knownLocations = knownLocations? knownLocations : [];

export default function Map() {
  const [markers, setMarkers] = React.useState(() => {
      try {
        const localMarkers = localStorage.getItem('markers');
        return localMarkers !== null ? JSON.parse(localMarkers) : [];
      } catch (e) {
        return [];
      }
  });
  const [loading, setLoading] = React.useState(false);
  const [knownLoc, setKnownLoc] = React.useState(knownLocations);
  const [k, setK] = React.useState(-1);
  let loaded = false;

  React.useEffect(() => {
    localStorage.setItem('markers', JSON.stringify(markers));
  }, [markers]);

  return (
    <div>
      <h1>Stop Finder</h1>
      <p>For when the friend group can't decide where to stop</p>
      <div id="mapcontainer">
        <MapDisplay markers={markers} setMarkers={setMarkers} knownLocations={knownLoc} setKnownLocations = {setKnownLoc}/>
        <PointList markers={markers} setMarkers={setMarkers}/>
      </div>
      <div id="formtray">
        <ClusterForm markers={markers} setMarkers={setMarkers} loading={loading} setLoading={setLoading}/>
      </div>
    </div>
    
);
}
