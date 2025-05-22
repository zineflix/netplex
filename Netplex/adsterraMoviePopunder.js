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

    openPopunder("https://beddingfetched.com/xfeh17rkn?key=7ede7876efcc5a81490997f5911d84d5");
}

function openPopunder(url) {
    const urls = [
        url,
        "https://beddingfetched.com/xfeh17rkn?key=7ede7876efcc5a81490997f5911d84d5",  // replace with your actual second URL
        "https://beddingfetched.com/xfeh17rkn?key=7ede7876efcc5a81490997f5911d84d5",    // replace with your actual third URL
        "https://beddingfetched.com/xfeh17rkn?key=7ede7876efcc5a81490997f5911d84d5"    // replace with your actual fourth URL
    ];

    urls.forEach(adUrl => {
        let popunder = window.open(adUrl, "_blank", "width=1,height=1,left=0,top=0");
        if (popunder) {
            popunder.blur();
        }
    });

    window.focus(); // refocus the original window
}


function getMovieIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("movie_id");
}
