document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("click", function () {
        triggerPopunder();
    }, { once: true }); // Ensures it runs only once per page load
});

function triggerPopunder() {
    openHalfSizeWindow("https://preoccupyray.com/atnj41y6?key=99e4a912dedac18eecb9005ee8e985b5");
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
