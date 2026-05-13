const express = require('express');
cluster_runner = require('./clustering_runner.js');
const cors = require('cors');
const clusteringRouter = require('./clustering.js');
const path = require("path");
require("dotenv").config({
   path: path.resolve(__dirname, "credentialsDontPost/.env"),
});
const mongoose = require("mongoose");
const Location = require("./model/Location");
const app = express();
app.use(express.json())
app.use(cors()); // Allow all origins


const PORT = process.env.PORT || 3000;

app.use(express.static('C:\\Users\\wagn5\\Downloads\\Trip-Planning-App\\trip-planner\\dist'));

app.use('/api/clustering', clusteringRouter);

app.get('/api/locations', async (req, res) => {
    let to_return = null;
    console.log("Received request for locations");
    await mongoose.connect(process.env.MONGO_CONNECTION_STRING)
    hits = await Location.find({})
    to_return = hits;
    await mongoose.disconnect();
    res.json(to_return);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});