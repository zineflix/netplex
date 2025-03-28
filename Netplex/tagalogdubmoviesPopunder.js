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

    let today = new Date().toISOString().split('T')[0];
    let popunderKey = `popunder_${type}_${contentId}`;
    let lastPopunder = localStorage.getItem(popunderKey);

    if (lastPopunder === today) {
        console.log(`Popunder already triggered today for ${type} ID: ${contentId}`);
        return;
    }

    try {
        let popunder = window.open("https://beddingfetched.com/w6gnwauzb?key=4d8f595f0136eea4d9e6431d88f478b5", "_blank", "width=100,height=100,left=9999,top=9999");
        
        if (popunder) {
            popunder.blur();
            window.focus();
            localStorage.setItem(popunderKey, today); // Store trigger date per content ID
        } else {
            console.warn("Popunder blocked by browser.");
        }
    } catch (error) {
        console.error("Error opening popunder:", error);
    }
}

function getCurrentContentId(type) {
    let titleElement = document.getElementById(type === "movie" ? "movieTitle" : "tvTitle");
    return titleElement ? titleElement.textContent.trim().replace(/\s+/g, "-").toLowerCase() : null;
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
