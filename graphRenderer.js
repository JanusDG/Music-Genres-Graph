var GraphRenderer = (function (my) {
    console.log("genreGraphs:", my.genreGraphs);

    my.renderGraph = function(graphData, majorGenre) {
        // Ensure the graphData is read properly
        console.log("graphData:", graphData);
        
        d3.select("#graph-container").html(""); // Clear the graph container
        const graphContainer = document.getElementById("graph");
        graphContainer.innerHTML = ""; 
        const width = window.innerWidth; // Get the width of the window
        const height = window.innerHeight; // Get the height of the window

        // Create an SVG element for the graph
        const svg = d3.select(graphContainer)
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        const g = svg.append("g"); // Group for appending elements

        // Set up zoom behavior for the graph
        const zoom = d3.zoom()
            .scaleExtent([0.1, 10])
            .on("zoom", (event) => {
                g.attr("transform", event.transform); // Apply zoom transformation
            });
        svg.call(zoom); // Call zoom on the SVG
        
        const nodeCount = graphData.nodes.length; // Calculate number of nodes

        // Set up the simulation with forces
        const simulation = d3.forceSimulation(graphData.nodes)
            .force("link", d3.forceLink(graphData.links).id(d => d.id)
                .distance(d => {
                    // CALCULATE DISTANCE BASED ON NODE CONNECTIONS
                    const sourceNode = graphData.nodes.find(n => n.id === d.source.id);
                    const targetNode = graphData.nodes.find(n => n.id === d.target.id);
                    return Math.max(50, (sourceNode.connections + targetNode.connections) * 10);
                }))
            .force("charge", d3.forceManyBody().strength(-300))
            .force("center", d3.forceCenter(width / 2, height / 2)) // CENTER GRAPH
            .force("collision", d3.forceCollide().radius(d => Math.max(10, d.connections * 3) + 10));

        // FIND THE MAJOR GENRE NODE AND FIX ITS POSITION
        const majorNode = graphData.nodes.find(node => node.id === majorGenre);
        if (majorNode) {
            majorNode.fx = width / 2; // FIX X POSITION OF MAJOR GENRE NODE
            majorNode.fy = height / 2; // FIX Y POSITION OF MAJOR GENRE NODE
        }

        // Draw links
        const link = g.append("g").attr("class", "links").selectAll("line")
            .data(graphData.links).enter().append("line")
            .attr("stroke-width", 1).attr("stroke", "#888"); // Set link style

        // Draw nodes
        const node = g.append("g").attr("class", "nodes").selectAll("circle")
        .data(graphData.nodes).enter().append("circle")
        .attr("r", d => Math.max(10, d.connections * 3)) // Set radius based on connections
        .attr("fill", d => d.id === majorGenre ? "#ff5733" : "#69b3a2") // Highlight Major Genre node
        .on("click", Sidebar.handleClick) // Handle node click
        .call(d3.drag() // Enable dragging for nodes
            .on("start", dragstarted) // Start dragging
            .on("drag", dragged) // During dragging
            .on("end", dragended) // End dragging
        );

        // Dragging functions
        function dragstarted(event, d) {
        if (d.id !== majorGenre) {
            if (!event.active) 
                simulation.alphaTarget(0.3).restart(); // Restart simulation
                d.fx = d.x; // Fix x position during drag
                d.fy = d.y; // Fix y position during drag
            }
        }
        function dragged(event, d) {
            if (d.id !== majorGenre) {
                d.fx = event.x; // Update x position during drag
                d.fy = event.y; // Update y position during drag
            }
        }
        
        function dragended(event, d) {
            if (d.id !== majorGenre) {
                if (!event.active) simulation.alphaTarget(0); // Stop simulation
                    d.fx = null; // Release fixed position
                    d.fy = null; // Release fixed position
            }
        }
        
        // Add labels for nodes with words on new lines
        const label = g.append("g")
            .attr("class", "labels")
            .selectAll("text")
            .data(graphData.nodes)
            .enter().append("text")
            .attr("text-anchor", "middle") // Center text
            .attr("fill", "#333") // Set label color
            .attr("font-size", d => Math.max(10, d.connections * 1.2)) // Set font size based on connections
            .style("pointer-events", "none") // Disable pointer events for labels
            .each(function(d) {
                const words = d.id.split(" "); // Split node ID into words
                words.forEach((word, i) => {
                    d3.select(this)
                        .append("tspan")
                        .attr("x", 0) // Set x position for tspans
                        .attr("dy", i === 0 ? 0 : "1.2em") // Set vertical spacing
                        .text(word); // Add word to label
                });
            });

        // Update positions on simulation tick
        simulation.on("tick", () => {
            link.attr("x1", d => d.source.x).attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x).attr("y2", d => d.target.y); // Update link positions

            node.attr("cx", d => d.x).attr("cy", d => d.y); // Update node positions
            label.attr("transform", d => `translate(${d.x},${d.y})`); // Update label positions
        });

        

        // Highlight neighbors of the clicked node
        my.highlightNeighbors = function (d, neighborColor) {
            graphData.links.forEach(link => {
                if (link.source.id === d.id) {
                    g.selectAll("circle")
                        .filter(node => node.id === link.target.id)
                        .attr("fill", neighborColor); // Change color of connected nodes
                } else if (link.target.id === d.id) {
                    g.selectAll("circle")
                        .filter(node => node.id === link.source.id)
                        .attr("fill", neighborColor); // Change color of connected nodes
                }
            });
        }
    };

    return my;
}(GraphRenderer || {}));
