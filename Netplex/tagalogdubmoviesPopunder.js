document.addEventListener("DOMContentLoaded", function () {
    const popunderUrl = "https://beddingfetched.com/w6gnwauzb?key=4d8f595f0136eea4d9e6431d88f478b5"; // Change to your ad URL
    const storageKey = "popunder_shown";

    function shouldShowPopunder(contentId) {
        const shownAds = JSON.parse(localStorage.getItem(storageKey)) || {};
        const lastShown = shownAds[contentId];

        if (!lastShown) return true; // Not shown before
        const today = new Date().toDateString();
        return lastShown !== today; // Show if not already triggered today
    }

    function setPopunderShown(contentId) {
        const shownAds = JSON.parse(localStorage.getItem(storageKey)) || {};
        shownAds[contentId] = new Date().toDateString();
        localStorage.setItem(storageKey, JSON.stringify(shownAds));
    }

    function openPopunder(url) {
        const newWin = window.open(url, "_blank");
        if (newWin) {
            newWin.blur();
            window.focus();
        }
    }

    function handleClick(event) {
        const movieId = event.target.dataset.movieId;
        const tvId = event.target.dataset.tvId;
        const contentId = movieId || tvId; // Use whichever exists

        if (!contentId || !shouldShowPopunder(contentId)) return;

        openPopunder(popunderUrl);
        setPopunderShown(contentId);
    }

    document.body.addEventListener("click", handleClick);
});
