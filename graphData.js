var GraphData = (function (my) {
    

    my.createGenreGraphs = function(data, majorGenres) {
        const genreGraphs = {};
        majorGenres.forEach(majorGenre => {
            genreGraphs[majorGenre] = { nodes: [], links: [] };
            const relatedGenres = findRelatedGenres(data, majorGenre);
            relatedGenres.forEach(genre => {
                if (!genreGraphs[majorGenre].nodes.find(n => n.id === genre)) {
                    genreGraphs[majorGenre].nodes.push({ id: genre, connections: 0 });
                }
                data[genre]?.forEach(relatedGenre => {
                    if (!genreGraphs[majorGenre].nodes.find(n => n.id === relatedGenre)) {
                        genreGraphs[majorGenre].nodes.push({ id: relatedGenre, connections: 0 });
                    }
                    genreGraphs[majorGenre].links.push({ source: genre, target: relatedGenre });
                });
            });
        });

        updateConnections(genreGraphs);
        
        return genreGraphs;
    };

    function findRelatedGenres(data, majorGenre) {
        const relatedGenres = [];
        for (const [genre, related] of Object.entries(data)) {
            if (related.includes(majorGenre)) {
                relatedGenres.push(genre);
            }
        }
        return relatedGenres;
    }

    function updateConnections(graphs) {
        Object.values(graphs).forEach(graph => {
            graph.nodes.forEach(node => {
                // Initialize connections and connected genres for each node
                node.connections = 0;
                node.connectedGenres = []; // New property to hold connected genre names
            });
    
            graph.links.forEach(link => {
                const sourceNode = graph.nodes.find(n => n.id === link.source);
                const targetNode = graph.nodes.find(n => n.id === link.target);
    
                // Increment connections count
                if (sourceNode) {
                    sourceNode.connections++;
                    // Add target node name to connected genres
                    if (!sourceNode.connectedGenres.includes(targetNode.id)) {
                        sourceNode.connectedGenres.push(targetNode.id);
                    }
                }
    
                if (targetNode) {
                    targetNode.connections++;
                    // Add source node name to connected genres
                    if (!targetNode.connectedGenres.includes(sourceNode.id)) {
                        targetNode.connectedGenres.push(sourceNode.id);
                    }
                }
            });
        });
    }
    

    return my;
}(GraphData || {}));
