var MODULE = (function (my) {
    // Wait for the DOM to fully load
    document.addEventListener("DOMContentLoaded", () => {
        // Load the related genres JSON file
        d3.json("related_genres.json").then(data => {
            
            // Ensure the data is read properly
            console.log("Data:", data);
            
            const majorGenres = [
                "Classical", "Pop", "Rock", "Hip Hop",
                "Electronic", "Jazz", "Metal", "Punk",
                "Folk", "Country", "Ambient"
            ];

            // Create genre graphs using the GraphData module
            my.genreGraphs = GraphData.createGenreGraphs(data, majorGenres);

            // Ensure the genreGraphs is read properly
            console.log("genreGraphs:", my.genreGraphs);
            
            // Set up the tabs for Major genres
            const tabs = document.querySelectorAll(".tab");
            tabs.forEach(tab => {
                tab.addEventListener("click", () => {
                    const selectedGenre = tab.getAttribute("data-genre");
                    GraphRenderer.renderGraph(my.genreGraphs[selectedGenre], selectedGenre);
                    Sidebar.showSidebar();
                });
            });
        }).catch(error => {
            console.error("Error loading genre data:", error);
        });
    });

    return my;
}(MODULE || {}));
