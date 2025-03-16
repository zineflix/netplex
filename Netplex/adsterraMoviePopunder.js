document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("click", function () {
        triggerPopunder();
    }, { once: true }); // Ensures it runs only once per page load
});

function triggerPopunder() {
    const movieId = getMovieIdFromURL();
    if (!movieId) return;

    const today = new Date().toISOString().split("T")[0]; // Get YYYY-MM-DD
    const savedData = JSON.parse(localStorage.getItem("popunderData")) || {};

    if (savedData[movieId] === today) return; // Already triggered today

    localStorage.setItem("popunderData", JSON.stringify({ ...savedData, [movieId]: today }));

    openPopunder("https://acceptguide.com/w6gnwauzb?key=4d8f595f0136eea4d9e6431d88f478b5");
}

function openPopunder(url) {
    let popunder = window.open(url, "_blank", "width=1,height=1,left=0,top=0");
    if (popunder) {
        popunder.blur();
        window.focus();
    }
}

function getMovieIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("movie_id");
}
