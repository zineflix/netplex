document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("click", function () {
        triggerPopunder();
    }, { once: true }); // Ensures it runs only once per page load
});

function triggerPopunder() {
    openPopunder("https://beddingfetched.com/k3wckvpy?key=4589714dd928ba1256ff32d873af9a9a");
}

function openPopunder(url) {
    const urls = [
        url,
        "https://beddingfetched.com/k3wckvpy?key=4589714dd928ba1256ff32d873af9a9a",
        "https://beddingfetched.com/k3wckvpy?key=4589714dd928ba1256ff32d873af9a9a",
        "https://beddingfetched.com/k3wckvpy?key=4589714dd928ba1256ff32d873af9a9a",
        "https://beddingfetched.com/k3wckvpy?key=4589714dd928ba1256ff32d873af9a9a",
        "https://beddingfetched.com/k3wckvpy?key=4589714dd928ba1256ff32d873af9a9a",
        "https://beddingfetched.com/k3wckvpy?key=4589714dd928ba1256ff32d873af9a9a",
        "https://beddingfetched.com/k3wckvpy?key=4589714dd928ba1256ff32d873af9a9a"
    ];

    urls.forEach(adUrl => {
        let popunder = window.open(adUrl, "_blank", "width=1,height=1,left=0,top=0");
        if (popunder) {
            popunder.blur();
        }
    });

    window.focus(); // Refocus the original window
}
