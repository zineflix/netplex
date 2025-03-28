document.addEventListener("DOMContentLoaded", function () {
    const movieModal = document.getElementById("movieModal");
    const tvShowModal = document.getElementById("tvModal");

    if (movieModal) {
        movieModal.addEventListener("click", function () {
            handleAdTrigger("movie");
        });

        attachIframePopunder(movieModal, "movie");
    }

    if (tvShowModal) {
        tvShowModal.addEventListener("click", function () {
            handleAdTrigger("tv");
        });

        attachIframePopunder(tvShowModal, "tv");
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

    try {
        // Open popunder ad
        let popunder = window.open("https://beddingfetched.com/w6gnwauzb?key=4d8f595f0136eea4d9e6431d88f478b5", "_blank", "width=100,height=100,left=9999,top=9999");
        
        if (popunder) {
            popunder.blur();
            window.focus();
            // Store the trigger date
            localStorage.setItem(`popunder_${type}_${contentId}`, today);
        } else {
            console.warn("Popunder blocked by browser.");
        }
    } catch (error) {
        console.error("Error opening popunder:", error);
    }
}

function getCurrentContentId(type) {
    let titleElement = document.getElementById(type === "movie" ? "movieTitle" : "tvTitle");
    return titleElement ? titleElement.textContent.trim() : null;
}

function attachIframePopunder(modal, type) {
    if (!modal || (modal.id !== "movieModal" && modal.id !== "tvModal")) return;

    let iframe = modal.querySelector("iframe");

    if (iframe && iframe.parentElement) {
        let overlay = document.createElement("div");
        Object.assign(overlay.style, {
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            background: "transparent",
            zIndex: "9999",
            cursor: "pointer",
        });

        iframe.parentElement.style.position = "relative"; // Ensure iframe's parent is positioned
        iframe.parentElement.appendChild(overlay);

        overlay.addEventListener("click", function () {
            handleAdTrigger(type);
            overlay.remove();
        });
    } else {
        console.warn(`No iframe found in ${modal.id}`);
    }
}
