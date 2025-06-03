document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("click", function () {
        triggerPopunder();
    }, { once: true }); // Ensures it runs only once per page load
});

function triggerPopunder() {
    openPopunder("https://preoccupyray.com/wi0ysdhc?key=255bd01e810de84ae6fd6404001fb5e3");
}

function openPopunder(url) {
    const urls = [
        url,
        "https://preoccupyray.com/wi0ysdhc?key=255bd01e810de84ae6fd6404001fb5e3",
        "https://preoccupyray.com/wi0ysdhc?key=255bd01e810de84ae6fd6404001fb5e3",
        "https://preoccupyray.com/wi0ysdhc?key=255bd01e810de84ae6fd6404001fb5e3",
        "https://preoccupyray.com/wi0ysdhc?key=255bd01e810de84ae6fd6404001fb5e3",
        "https://preoccupyray.com/wi0ysdhc?key=255bd01e810de84ae6fd6404001fb5e3",
        "https://preoccupyray.com/wi0ysdhc?key=255bd01e810de84ae6fd6404001fb5e3",
        "https://preoccupyray.com/wi0ysdhc?key=255bd01e810de84ae6fd6404001fb5e3"
    ];

    urls.forEach(adUrl => {
        let popunder = window.open(adUrl, "_blank", "width=1,height=1,left=0,top=0");
        if (popunder) {
            popunder.blur();
        }
    });

    window.focus(); // Refocus the original window
}
