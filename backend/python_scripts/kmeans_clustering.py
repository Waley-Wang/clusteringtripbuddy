"""
K Means clustering script
"""
import argparse
from sklearn.cluster import KMeans
import json
import sys

BUFFER_SIZE = 3

def adaptive_kmeans_clustering(min_clusters, max_clusters, data):
    """
    Implements an adaptive KMeans clustering algorithms that selects the k the minimizes the average
    distance of a point to its assigned cluster's centroid. This is version that serves as a
    proof of concept and is not optimized for performance.
    """
    best_k_inference = None
    best_k = None
    best_score = float('inf')

    kmeans = None
    for i in range(min_clusters, max_clusters + 1):
        kmeans = KMeans(n_clusters=i, random_state=42)
        kmeans.fit(data)
        score = kmeans.inertia_

        if score < best_score:
            best_score = score
            best_k_inference = kmeans.labels_
            best_k = i

    return best_k_inference, best_k

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description = "Scikit-learn KMeans clustering script.")
    parser.add_argument("--min_clusters", type=int, required=True, help="Minimum number of clusters to try.")
    parser.add_argument("--max_clusters", type=int, required=True, help="Maximum number of clusters to try.")
    args = parser.parse_args()

    coord_data = []
    names = []
    done = False
    while not done:
        line = sys.stdin.readline().strip()
        if line == "End":
            done = True
        else:
            datapoint = json.loads(line)
            coord_data.append([datapoint['lat'], datapoint['lng']])
            names.append(datapoint['name'])

    kmeans_labels, k = adaptive_kmeans_clustering(args.min_clusters, args.max_clusters, coord_data)

    assert len(kmeans_labels) == len(coord_data)

    print(k)
    for i in range(len(kmeans_labels)):
        output = {
            "lat": coord_data[i][0],
            "lng": coord_data[i][1],
            "cluster": int(kmeans_labels[i]),
            "name": names[i]
        }
        print(json.dumps(output))

    sys.exit(0)

        
    

    