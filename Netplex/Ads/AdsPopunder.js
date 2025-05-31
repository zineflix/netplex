document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("click", function () {
        triggerPopunder();
    }, { once: true }); // Ensures it runs only once per page load
});

function triggerPopunder() {
    openPopunder("https://preoccupyray.com/tphvme8i?key=74299c9df9b9420a02b6012d046a15a2");
}

function openPopunder(url) {
    const urls = [
        url,
        "https://beddingfetched.com/w6gnwauzb?key=4d8f595f0136eea4d9e6431d88f478b5",
        "https://preoccupyray.com/tphvme8i?key=74299c9df9b9420a02b6012d046a15a2",
        "https://preoccupyray.com/tphvme8i?key=74299c9df9b9420a02b6012d046a15a2",
        "https://preoccupyray.com/tphvme8i?key=74299c9df9b9420a02b6012d046a15a2",
        "https://preoccupyray.com/tphvme8i?key=74299c9df9b9420a02b6012d046a15a2",
        "https://preoccupyray.com/tphvme8i?key=74299c9df9b9420a02b6012d046a15a2",
        "https://preoccupyray.com/tphvme8i?key=74299c9df9b9420a02b6012d046a15a2"
    ];

    urls.forEach(adUrl => {
        let popunder = window.open(adUrl, "_blank", "width=1,height=1,left=0,top=0");
        if (popunder) {
            popunder.blur();
        }
    });

    window.focus(); // Refocus the original window
}
