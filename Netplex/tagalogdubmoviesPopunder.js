document.addEventListener("DOMContentLoaded", function () {
    const movieModal = document.getElementById("movieModal");
    const tvShowModal = document.getElementById("tvModal"); // Corrected ID

    if (!movieModal && !tvShowModal) return;

    [movieModal, tvShowModal].forEach((modal) => {
        if (!modal) return;
        
        modal.addEventListener("click", function (event) {
            let { id, type } = getCurrentMediaId();
            if (!id) return;

            let storageKey = `popunder_${type}_${id}`;
            let lastPopunder = localStorage.getItem(storageKey);
            let today = new Date().toISOString().split('T')[0];

            if (lastPopunder === today) {
                console.log(`Popunder already triggered today for this ${type}.`);
                return;
            }

            // Open popunder
            openPopunder("https://beddingfetched.com/w6gnwauzb?key=4d8f595f0136eea4d9e6431d88f478b5");

            // Store the trigger date
            localStorage.setItem(storageKey, today);
        });
    });

    function getCurrentMediaId() {
        let movieTitleElement = document.getElementById("movieTitle");
        let tvShowTitleElement = document.getElementById("tvTitle"); // Corrected ID

        if (movieTitleElement) {
            return { id: movieTitleElement.textContent.trim(), type: "movie" };
        } else if (tvShowTitleElement) {
            return { id: tvShowTitleElement.textContent.trim(), type: "tv" };
        }

        return { id: null, type: null };
    }

    function openPopunder(url) {
        let popunder = window.open(url, "_blank", "width=100,height=100,left=9999,top=9999");
        if (popunder) {
            popunder.blur();
            window.focus();
        }
    }

    function openAd() {
        const adUrl = "https://beddingfetched.com/w6gnwauzb?key=4d8f595f0136eea4d9e6431d88f478b5"; // Replace with your actual ad link
        const newWindow = window.open(adUrl, "_blank");

        if (newWindow) {
            newWindow.blur(); // Move focus away from the new tab
            window.focus(); // Bring focus back to the main page
        }
    }

    // Add click event to movie trailer iframe
    const movieTrailer = document.getElementById("movieTrailer");
    if (movieTrailer) {
        movieTrailer.addEventListener("click", openAd);
    }

    // Add click event to TV trailer iframe
    const tvTrailer = document.getElementById("tvTrailer");
    if (tvTrailer) {
        tvTrailer.addEventListener("click", openAd);
    }
});
