document.addEventListener("DOMContentLoaded", function () {
    const movieIframe = document.querySelector("#movieModal iframe");
    const tvIframe = document.querySelector("#tvModal iframe");

    if (movieIframe) {
        attachPlayListener(movieIframe);
    }

    if (tvIframe) {
        attachPlayListener(tvIframe);
    }
});

function attachPlayListener(iframe) {
    iframe.addEventListener("load", function () {
        let iframeWindow = iframe.contentWindow || iframe;
        iframeWindow.addEventListener("playing", function () {
            handleAdTrigger();
        }, true);
    });
}

function handleAdTrigger() {
    let lastPopunder = localStorage.getItem("popunder_triggered");
    let today = new Date().toISOString().split('T')[0];

    if (lastPopunder === today) {
        console.log("Popunder already triggered today.");
        return;
    }

    // Open popunder ad
    openPopunder("https://beddingfetched.com/w6gnwauzb?key=4d8f595f0136eea4d9e6431d88f478b5");

    // Store the trigger date
    localStorage.setItem("popunder_triggered", today);
}

function openPopunder(url) {
    let popunder = window.open(url, "_blank", "width=100,height=100,left=9999,top=9999");
    if (popunder) {
        popunder.blur();
        window.focus();
    }
}
