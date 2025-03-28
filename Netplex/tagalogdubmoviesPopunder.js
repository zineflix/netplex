document.addEventListener("DOMContentLoaded", function () {
    setupPopunder("movieModal", "movieTitle");
    setupPopunder("tvModal", "tvTitle");
});

function setupPopunder(modalId, titleId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    // Listen for clicks anywhere inside the modal, including the video
    modal.addEventListener("click", function (event) {
        event.stopPropagation(); // Prevent event from bubbling

        let contentId = getContentId(titleId);
        if (!contentId) return;

        let lastPopunder = localStorage.getItem(`popunder_${contentId}`);
        let today = new Date().toISOString().split('T')[0];

        if (lastPopunder === today) {
            console.log(`Popunder already triggered today for ${titleId}.`);
            return;
        }

        // Show popunder overlay to ensure user interaction
        showPopunderOverlay(() => {
            openPopunder("https://beddingfetched.com/w6gnwauzb?key=4d8f595f0136eea4d9e6431d88f478b5");
            localStorage.setItem(`popunder_${contentId}`, today);
        });
    });
}

function getContentId(titleId) {
    let titleElement = document.getElementById(titleId);
    return titleElement ? titleElement.textContent.trim() : null;
}

function openPopunder(url) {
    let popunder = window.open(url, "_blank", "width=100,height=100,left=9999,top=9999");
    if (popunder) {
        popunder.blur();
        window.focus();
    } else {
        console.warn("Popunder blocked by browser.");
    }
}

function showPopunderOverlay(callback) {
    let overlay = document.createElement("div");
    Object.assign(overlay.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: "9999",
        cursor: "pointer",
    });

    document.body.appendChild(overlay);

    overlay.addEventListener("click", function () {
        document.body.removeChild(overlay);
        if (callback) callback(); // Open the popunder on click
    });
}
