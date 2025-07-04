document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("click", function () {
        triggerPopunder();
    }, { once: true }); // Runs only once per page load
});

function triggerPopunder() {
    const urls = [
        "https://www.profitableratecpm.com/np2rx5jyqx?key=129e79f19bf33a68173e82569c57885f",
        "https://www.profitableratecpm.com/np2rx5jyqx?key=129e79f19bf33a68173e82569c57885f", // Same URL
        "https://www.profitableratecpm.com/np2rx5jyqx?key=129e79f19bf33a68173e82569c57885f"  // Same URL
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
