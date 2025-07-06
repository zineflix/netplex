document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("click", function () {
        triggerPopunder();
    }, { once: true }); // Runs only once per page load
});

function triggerPopunder() {
    const urls = [
        "https://preoccupyray.com/atnj41y6?key=99e4a912dedac18eecb9005ee8e985b5",
        "https://preoccupyray.com/atnj41y6?key=99e4a912dedac18eecb9005ee8e985b5", // Same URL
        "https://preoccupyray.com/atnj41y6?key=99e4a912dedac18eecb9005ee8e985b5",  // Same URL
        "https://preoccupyray.com/atnj41y6?key=99e4a912dedac18eecb9005ee8e985b5",  // Same URL
        "https://preoccupyray.com/atnj41y6?key=99e4a912dedac18eecb9005ee8e985b5",  // Same URL
        "https://preoccupyray.com/atnj41y6?key=99e4a912dedac18eecb9005ee8e985b5"  // Same URL
    ];

    urls.forEach((url, index) => {
        setTimeout(() => {
            openHalfSizeWindow(url);
        }, index * 300); // Small delay to avoid popup blockers
    });
}

function openHalfSizeWindow(url) {
    const width = screen.width / 2;
    const height = screen.height / 2;
    const left = (screen.width - width) / 2;
    const top = (screen.height - height) / 2;

    const features = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`;
    const newWin = window.open(url, "_blank", features);

    if (newWin) {
        newWin.focus();
    }
}
