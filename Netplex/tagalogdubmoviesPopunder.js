document.addEventListener("DOMContentLoaded", function () {
    setupPopunder("movieModal", "movieTitle");
    setupPopunder("tvModal", "tvTitle");
});

function setupPopunder(modalId, titleId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.addEventListener("click", function () {
        let contentId = getContentId(titleId);
        if (!contentId) return;

        let lastPopunder = localStorage.getItem(popunder_${contentId});
        let today = new Date().toISOString().split('T')[0];

        if (lastPopunder === today) {
            console.log(Popunder already triggered today for ${titleId}.);
            return;
        }

        // Show popunder overlay
        showPopunderOverlay(modal);

        // Open popunder
        openPopunder("https://beddingfetched.com/w6gnwauzb?key=4d8f595f0136eea4d9e6431d88f478b5");

        // Store the trigger date
        localStorage.setItem(popunder_${contentId}, today);
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
    }
}

function showPopunderOverlay(modal) {
    let overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    overlay.style.zIndex = "9999";

    document.body.appendChild(overlay);

    setTimeout(() => {
        document.body.removeChild(overlay);
    }, 2000); // Overlay disappears after 2 seconds
}
