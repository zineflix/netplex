document.addEventListener("DOMContentLoaded", function () {
    function openPopunder(url) {
        let newWindow = window.open(url, "_blank");
        if (newWindow) {
            newWindow.blur(); // Sends it to the background
            window.focus(); // Refocuses the current page
        }
    }

    function setupPopunder(modalId) {
        let modal = document.getElementById(modalId);
        if (!modal) return;

        modal.addEventListener("click", function (event) {
            let iframe = modal.querySelector("iframe");
            if (iframe && event.target === iframe) {
                openPopunder("https://beddingfetched.com/w6gnwauzb?key=4d8f595f0136eea4d9e6431d88f478b5"); // Change this to your desired link
            }
        });
    }

    setupPopunder("movieModal");
    setupPopunder("tvModal");
});
