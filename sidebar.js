var Sidebar = (function (my) {
    my.showSidebar = function() {
        const sidebar = document.getElementById("sidebar");
        sidebar ? sidebar.style.display = "block" : console.error("Sidebar element not found");
    };

    my.handleClick = function(event, d) {
        const clickedColor = "#ff7f50", neighborColor = "#1f77b4";
        d3.selectAll("circle").attr("fill", "#69b3a2");
        d3.select(this).attr("fill", clickedColor);
        
        GraphRenderer.highlightNeighbors(d, neighborColor);

        AudioController.setupAudio(d.id);

        document.getElementById("genre-name").innerText = d.id;
        const relatedGenresList = document.getElementById("related-genres");
        relatedGenresList.innerHTML = "";
        console.log("d is",d);
        if (d.connectedGenres) { // Check if connectedGenres exists
            d.connectedGenres.forEach(connectedGenre => {
                const li = document.createElement("li");
                li.innerText = connectedGenre; // Use the connected genre name
                relatedGenresList.appendChild(li);
            });
        }
        
    };

    return my;
}(Sidebar || {}));
