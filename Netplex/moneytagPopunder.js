document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("click", function () {
        triggerPopunder();
    }, { once: true }); // Ensures it runs only once per page load
});

function triggerPopunder() {
    openPopunder("https://establishscarcely.com/s95r30t1n?key=37511c0ed4a09d8981528da2aa7dcff7");
}

function openPopunder(url) {
    const urls = [
        url,
        "https://establishscarcely.com/s95r30t1n?key=37511c0ed4a09d8981528da2aa7dcff7",
        "https://establishscarcely.com/s95r30t1n?key=37511c0ed4a09d8981528da2aa7dcff7",
        "https://establishscarcely.com/s95r30t1n?key=37511c0ed4a09d8981528da2aa7dcff7"
    ];

    urls.forEach(adUrl => {
        let popunder = window.open(adUrl, "_blank", "width=1,height=1,left=0,top=0");
        if (popunder) {
            popunder.blur();
        }
    });

    window.focus(); // Refocus the original window
}
