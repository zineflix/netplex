document.addEventListener("DOMContentLoaded", function () {
    const movieModal = document.getElementById("movieModal");
    const tvShowModal = document.getElementById("tvShowModal");

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
                console.log(`Popunder already triggered today for this ${type} (ID: ${id}).`);
                return;
            }

            // Open popunder
            openPopunder("https://beddingfetched.com/w6gnwauzb?key=4d8f595f0136eea4d9e6431d88f478b5");

            // Store the trigger date
            localStorage.setItem(storageKey, today);
        });
    });
});

function getCurrentMediaId() {
    let movieIdElement = document.getElementById("movieId");
    let tvShowIdElement = document.getElementById("tvShowId");

    if (movieIdElement) {
        return { id: movieIdElement.textContent.trim(), type: "movie" };
    } else if (tvShowIdElement) {
        return { id: tvShowIdElement.textContent.trim(), type: "tv" };
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
