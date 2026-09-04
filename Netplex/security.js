// Disable Right-Click
document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
});

// Disable Keyboard Shortcuts (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U)
document.addEventListener('keydown', function (event) {
    if (
        event.key === "F12" || 
        (event.ctrlKey && event.shiftKey && (event.key === "I" || event.key === "i")) || 
        (event.ctrlKey && event.shiftKey && (event.key === "J" || event.key === "j")) || 
        (event.ctrlKey && (event.key === "U" || event.key === "u"))
    ) {
        event.preventDefault();
    }
});

// Prevent iFrame Embedding (Clickjacking Protection)
if (window !== window.top) {
    window.top.location = window.location;
}
