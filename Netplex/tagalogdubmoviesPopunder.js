document.addEventListener("DOMContentLoaded", function () {
    const movieModal = document.getElementById("movieModal");

    if (!movieModal) return;

    movieModal.addEventListener("click", function (event) {
        // Get the current movie ID (based on the modal's title)
        let movieId = getCurrentMovieId();
        if (!movieId) return;

        let lastPopunder = localStorage.getItem(`popunder_${movieId}`);
        let today = new Date().toISOString().split('T')[0];

        if (lastPopunder === today) {
            console.log("Popunder already triggered today for this movie.");
            return;
        }

        // Open popunder
        openPopunder("https://acceptguide.com/w6gnwauzb?key=4d8f595f0136eea4d9e6431d88f478b5");

        // Store the trigger date
        localStorage.setItem(`popunder_${movieId}`, today);
    });
});

function getCurrentMovieId() {
    let movieTitleElement = document.getElementById("movieTitle");
    return movieTitleElement ? movieTitleElement.textContent.trim() : null;
}

function openPopunder(url) {
    let popunder = window.open(url, "_blank", "width=100,height=100,left=9999,top=9999");
    if (popunder) {
        popunder.blur();
        window.focus();
    }
}
