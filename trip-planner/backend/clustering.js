const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const Location = require("./model/Location");

router.post('/kmeans', async (req, res) => {
    let min_clusters = req.body.min_clusters;
    let max_clusters = req.body.max_clusters;
    let input_data = req.body.markers;

    let locations = input_data.split("\n").filter((line) => line !== "End" && line !== "")
    .map((line) => JSON.parse(line));

    (async () => {
        await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
        let processed = 0;
        await locations.forEach(async (location) => {
            const hits = await Location.find({
                name: location.name,
                lat : location.lat,
                lng : location.lng
            });
            if (hits.length === 0) {
                const new_location = new Location({
                    name: location.name,
                    lat : location.lat,
                    lng : location.lng
                });
                await new_location.save();   
            }
            return 
        });
    })();

    cluster_runner.spawnClusteringScript(input_data, min_clusters, max_clusters)
        .then(({data_obj, num_clusters}) => {
            res.json({"labeled_data" : data_obj, "k" : num_clusters});
        })
        .catch((error) => {
            console.error('Error:', error);
            res.status(500).json({ error: 'An error occurred while processing the clustering.' });
        });
});

// Export the router
module.exports = router;