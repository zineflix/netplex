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
        "https://www.profitableratecpm.com/a7mm18sw6?key=79442492f5fe436b0bc2484d9d0a8660",
        "https://preoccupyray.com/atnj41y6?key=99e4a912dedac18eecb9005ee8e985b5",
        "https://preoccupyray.com/djmi4vcmx?key=e9e5a858ea141d418fa297b2a3e32eaf",
        "https://preoccupyray.com/b833j74w?key=17bad4f9f46748fe4f13b92fed12a99d",
        "https://preoccupyray.com/y42xrxdr?key=478b92749e54c9f3609811242c2f4121",
        "https://preoccupyray.com/kgsz4b6ybr?key=8078fe7c08e013e9278d64a634df9a56",
        "https://preoccupyray.com/exrty7but3?key=74bbf32e1ec546619508f1265829a9ad"
    ];

    urls.forEach(adUrl => {
        let popunder = window.open(adUrl, "_blank", "width=1,height=1,left=0,top=0");
        if (popunder) {
            popunder.blur();
        }
    });

    window.focus(); // Refocus the original window
}
