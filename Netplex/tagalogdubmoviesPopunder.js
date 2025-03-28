document.addEventListener("DOMContentLoaded", function () {
    const movieModal = document.getElementById("movieModal");
    const tvShowModal = document.getElementById("tvModal"); // TV Show Modal

    if (movieModal) {
        movieModal.addEventListener("click", function (event) {
            // Ensure ad triggers only when clicking inside the modal
            if (event.target === movieModal || movieModal.contains(event.target)) {
                handleAdTrigger("movie");
            }
        });
    }

    if (tvShowModal) {
        tvShowModal.addEventListener("click", function (event) {
            // Ensure ad triggers only when clicking inside the modal
            if (event.target === tvShowModal || tvShowModal.contains(event.target)) {
                handleAdTrigger("tv");
            }
        });
    }
});

function handleAdTrigger(type) {
    let contentId = getCurrentContentId(type);
    if (!contentId) return;

    let lastPopunder = localStorage.getItem(`popunder_${type}_${contentId}`);
    let today = new Date().toISOString().split('T')[0];

    if (lastPopunder === today) {
        console.log(`Popunder already triggered today for this ${type}.`);
        return;
    }

    // Open popunder ad
    openPopunder("https://beddingfetched.com/w6gnwauzb?key=4d8f595f0136eea4d9e6431d88f478b5");

    // Store the trigger date
    localStorage.setItem(`popunder_${type}_${contentId}`, today);
}

function getCurrentContentId(type) {
    let titleElement = document.getElementById(type === "movie" ? "movieTitle" : "tvTitle");
    return titleElement ? titleElement.textContent.trim() : null;
}

function openPopunder(url) {
    let popunder = window.open(url, "_blank", "width=100,height=100,left=9999,top=9999");
    if (popunder) {
        popunder.blur();
        window.focus();
    }
}
