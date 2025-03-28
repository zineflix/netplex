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

        let lastPopunder = localStorage.getItem(`popunder_${contentId}`);
        let today = new Date().toISOString().split('T')[0];

        if (lastPopunder === today) {
            console.log(`Popunder already triggered today for ${titleId}.`);
            return;
        }

        // Open popunder
        openPopunder("https://beddingfetched.com/w6gnwauzb?key=4d8f595f0136eea4d9e6431d88f478b5");

        // Store the trigger date
        localStorage.setItem(`popunder_${contentId}`, today);
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
