import React from 'react';
import './Forms.css';

const API_URL = import.meta.env.VITE_API_URL;

async function setClusterNumbers(min, max, markers, setMarkers, loading, setLoading) {
    setLoading(true);
    let marker_data = markers.map((marker) => {
        return JSON.stringify(marker);
    }).join('\n') + "\nEnd\n";

    fetch(API_URL + '/clustering/kmeans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body : JSON.stringify({min_clusters : min, max_clusters : max, markers : marker_data})
    })
    .then((response) => {return response.json();})
    .then((response) => {
        setLoading(false);
        let labeled_data = response.labeled_data;
        let k = response.k;
        setMarkers(labeled_data);
    })
    .catch((error) => {
        setLoading(false);
        console.error('Error:', error);
    });
}

export default function ClusterForm({markers, setMarkers, loading, setLoading}) {
    return (
        <form id="clusterform" onSubmit={(event) => {
            event.preventDefault();
            const min = document.getElementById('minclusters').value;
            const max = document.getElementById('maxclusters').value;
            setClusterNumbers(min, max, markers, setMarkers, loading, setLoading);
        }}>
            <fieldset>
            <legend align = "center"> Clustering</legend>
            <label htmlFor="minclusters">Cluster Min: </label>
            <input type="number" id="minclusters" name="minclusters" min="1" max={markers.length} required />
            <label htmlFor="maxclusters">Cluster Max: </label>
            <input type="number" id="maxclusters" name="maxclusters" min="1" max={markers.length} required />
            <button type="submit" id="clusterbutton">Cluster</button>
            </fieldset>
        </form>);
}