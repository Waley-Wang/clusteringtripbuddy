import React from 'react';
import './Map.css';

export default function PointList({markers, setMarkers}) {
    return (
    <div id="pointlist">

        <table>
            <thead>
                <tr>
                    <th class="activitycol">Acivity Name</th>
                    <th class="clustercol">Cluster No.</th>
                    <th class="delcol"> <button onClick={() => {
                        setMarkers([]);
                    }}> Clear </button></th>
                </tr>
            </thead>
            <tbody>

        {markers.map((marker, idx) => {
            let name = marker.name;
            let cluster = marker.cluster + 1;
            if (isNaN(cluster)) {
                cluster = 'Unclustered';
            }
            return (
                <tr key = {idx}>
                    <td class="activitycol"> <input type="text" onChange = {
                        (e) => {
                            const newName = e.target.value;
                            setMarkers(markers.map((m, i) => {
                                if (i === idx) {
                                    return {...m, name: newName};
                                } else {
                                    return m; 
                                }}));
                        }
                    } value = {name}></input></td>
                    <td class="clustercol" >{cluster}</td>
                    <td class="delcol"><button onClick = {() => {
                        setMarkers(markers.filter((_, i) => i !== idx));
                    }}>X</button></td>
                </tr> 
            )
        })}
            </tbody>
        </table>
    
    </div>);
}