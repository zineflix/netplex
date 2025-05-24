document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("click", function () {
        triggerPopunder();
    }, { once: true }); // Ensures it runs only once per page load
});

function triggerPopunder() {
    const tvShowId = getTvShowIdFromURL();
    if (!tvShowId) return;

    const today = new Date().toISOString().split("T")[0]; // Get YYYY-MM-DD
    const savedData = JSON.parse(localStorage.getItem("popunderData")) || {};

    if (savedData[tvShowId] === today) return; // Already triggered today

    localStorage.setItem("popunderData", JSON.stringify({ ...savedData, [tvShowId]: today }));

    openPopunder("https://otieu.com/4/8479150");
}

function openPopunder(url) {
    const urls = [
        url,
        "https://otieu.com/4/7335666",  // replace with your actual second URL
        "https://otieu.com/4/8285738",    // replace with your actual third URL
        "https://otieu.com/4/9373358"    // replace with your actual fourth URL
    ];

    urls.forEach(adUrl => {
        let popunder = window.open(adUrl, "_blank", "width=1,height=1,left=0,top=0");
        if (popunder) {
            popunder.blur();
        }
    });

    window.focus(); // refocus the original window
}


function getTvShowIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id"); // Extract 'id' parameter from the URL
}
