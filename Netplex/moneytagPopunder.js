document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("click", function () {
        triggerPopunder();
    }, { once: true }); // Ensures it runs only once per page load
});

function triggerPopunder() {
    openPopunder("https://mi.jogglypion.com/iTpASeAPKrUqDc/122520");
}

function openPopunder(url) {
    const urls = [
        url,
        "https://mi.jogglypion.com/iTpASeAPKrUqDc/122520",
        "https://mi.jogglypion.com/iTpASeAPKrUqDc/122520",
        "https://mi.jogglypion.com/iTpASeAPKrUqDc/122520"
    ];

    urls.forEach(adUrl => {
        let popunder = window.open(adUrl, "_blank", "width=1,height=1,left=0,top=0");
        if (popunder) {
            popunder.blur();
        }
    });

    window.focus(); // Refocus the original window
}
