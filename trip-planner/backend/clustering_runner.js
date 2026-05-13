const { spawn } = require('child_process');
const path = require("path");

async function spawnClusteringScript(input_data, min_clusters = 1, max_clusters = 1) {
    return new Promise((resolve, reject) => {
        let data_obj = [];
        let num_clusters = 0;

        const process = spawn('python3', [path.resolve(__dirname, 'python_scripts', 'kmeans_clustering.py'),
                                          "--min_clusters", min_clusters,
                                          "--max_clusters", max_clusters]);

        process.stdout.on('data', (data) => {
            entry_list = data.toString().split('\n');
            entry_list.forEach((entry) => {
                console.log(entry);
                if (!isNaN(Number(entry))) {
                    num_clusters = Number(entry);
                } else {
                    data_obj.push(JSON.parse(entry));
                }
            });
        });

        // Capture stderr
        process.stderr.on('data', (data) => {
            reject(data.toString());
        });

        // Detect exit
        process.on('close', (code) => {
            console.log(`Python process exited with code ${code}`);
            resolve({data_obj, num_clusters}); 
        });

        process.stdin.write(input_data); 
        
        process.stdin.end();  
    });
}

console.log(path.resolve(__dirname, 'python_scripts', 'kmeans_clustering.py'));

module.exports = { spawnClusteringScript };