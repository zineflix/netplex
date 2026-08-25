// Responsive Header (Scroll Detection)
window.addEventListener("scroll", function () {
    let nav = document.querySelector("nav");
    if (nav) {
        if (window.scrollY > 50) {
            nav.classList.add("nav-solid"); // Solid color after scrolling down
        } else {
            nav.classList.remove("nav-solid"); // Transparent at the top
        }
    }
});

// Dropdown More Button Function
document.addEventListener("DOMContentLoaded", function () {
    const dropdown = document.querySelector(".dropdown");
    if (dropdown) {
        dropdown.addEventListener("click", function () {
            this.classList.toggle("active");
        });
    }
});

/* =========================================
   MOBILE BOTTOM NAVIGATION
========================================= */

document.addEventListener("DOMContentLoaded", function () {
    const moreButton = document.getElementById("mobile-more-btn");
    const moreMenu = document.getElementById("mobile-more-menu");

    /* CHECK ELEMENTS */
    if (!moreButton || !moreMenu) {
        return;
    }

    /* OPEN / CLOSE MORE MENU */
    moreButton.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        moreMenu.classList.toggle("show");
        moreButton.classList.toggle("active");
    });

    /* KEEP MENU OPEN WHEN CLICKING INSIDE */
    moreMenu.addEventListener("click", function (event) {
        event.stopPropagation();
    });

    /* CLOSE WHEN CLICKING OUTSIDE */
    document.addEventListener("click", function () {
        moreMenu.classList.remove("show");
        moreButton.classList.remove("active");
    });

    /* CLOSE WITH ESC KEY */
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            moreMenu.classList.remove("show");
            moreButton.classList.remove("active");
        }
    });
});
