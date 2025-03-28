document.addEventListener("DOMContentLoaded", function () {
    document.body.addEventListener("click", function (event) {
        if (event.target.closest("#movieModal") || event.target.closest("#tvModal")) {
            let modalId = event.target.closest("#movieModal") ? "movieModal" : "tvModal";
            let titleId = modalId === "movieModal" ? "movieTitle" : "tvTitle";
            triggerPopunder(modalId, titleId);
        }
    });
});

function triggerPopunder(modalId, titleId) {
    let contentId = getContentId(titleId);
    if (!contentId) return;

    let lastPopunder = localStorage.getItem(`popunder_${contentId}`);
    let today = new Date().toISOString().split('T')[0];

    if (lastPopunder === today) {
        console.log(`Popunder already triggered today for ${titleId}.`);
        return;
    }

    showPopunderOverlay();
    openPopunder("https://beddingfetched.com/w6gnwauzb?key=4d8f595f0136eea4d9e6431d88f478b5");
    localStorage.setItem(`popunder_${contentId}`, today);
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

function showPopunderOverlay() {
    let overlay = document.createElement("div");
    Object.assign(overlay.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: "9999",
    });

    document.body.appendChild(overlay);
    setTimeout(() => document.body.removeChild(overlay), 2000);
}
