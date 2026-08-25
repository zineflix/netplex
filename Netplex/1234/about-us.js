// For Responsive Header
window.addEventListener("scroll", function () {
    let nav = document.querySelector("nav");
    if (window.scrollY > 50) {
        nav.classList.add("nav-solid"); // Solid color after scrolling down
    } else {
        nav.classList.remove("nav-solid"); // Transparent at the top
    }
});

// For sticky header when scrolling
    window.addEventListener("scroll", function () {
      let nav = document.querySelector("nav");
      if (window.scrollY > 50) {
        nav.classList.add("nav-solid"); // Add solid background when scrolled
      } else {
        nav.classList.remove("nav-solid"); // Remove solid background at top
      }
    });


// For Dropdown More Button Function Start
document.addEventListener("DOMContentLoaded", function () {
    const dropdown = document.querySelector(".dropdown");

    dropdown.addEventListener("click", function () {
        this.classList.toggle("active");
    });
});
// For Dropdown More Button Function End

/* =========================================
   MOBILE BOTTOM NAVIGATION
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const moreButton =
        document.getElementById("mobile-more-btn");

    const moreMenu =
        document.getElementById("mobile-more-menu");


    /* =====================================
       CHECK ELEMENTS
    ===================================== */

    if (!moreButton || !moreMenu) {
        return;
    }


    /* =====================================
       OPEN / CLOSE MORE
    ===================================== */

    moreButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();

            moreMenu.classList.toggle("show");

            moreButton.classList.toggle("active");

        }
    );


    /* =====================================
       PREVENT POPUP FROM CLOSING
    ===================================== */

    moreMenu.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

        }
    );


    /* =====================================
       CLOSE WHEN CLICKING OUTSIDE
    ===================================== */

    document.addEventListener(
        "click",
        function () {

            moreMenu.classList.remove("show");

            moreButton.classList.remove("active");

        }
    );


    /* =====================================
       CLOSE WITH ESC
    ===================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                moreMenu.classList.remove("show");

                moreButton.classList.remove("active");

            }

        }
    );

});
