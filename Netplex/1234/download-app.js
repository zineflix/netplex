// Platform Switcher Function
function switchPlatform(event, platformId) {
    // Remove active class from buttons
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => tab.classList.remove('active'));

    // Remove active class from platform cards
    const cards = document.querySelectorAll('.platform-card');
    cards.forEach(card => card.classList.remove('active-card'));

    // Set active tab & card
    event.currentTarget.classList.add('active');
    document.getElementById(platformId).classList.add('active-card');
}

// For Responsive Header
window.addEventListener("scroll", function () {
    let nav = document.querySelector("nav");
    if (window.scrollY > 50) {
        nav.classList.add("nav-solid");
    } else {
        nav.classList.remove("nav-solid");
    }
});

// For Dropdown More Button Function
document.addEventListener("DOMContentLoaded", function () {
    const dropdown = document.querySelector(".dropdown");
    if (dropdown) {
        dropdown.addEventListener("click", function () {
            this.classList.toggle("active");
        });
    }

    const mobileMoreBtn = document.getElementById("mobile-more-btn");
    const mobileMoreMenu = document.getElementById("mobile-more-menu");
    if (mobileMoreBtn && mobileMoreMenu) {
        mobileMoreBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            mobileMoreMenu.classList.toggle("show");
        });
        document.addEventListener("click", function (e) {
            if (!mobileMoreMenu.contains(e.target) && e.target !== mobileMoreBtn) {
                mobileMoreMenu.classList.remove("show");
            }
        });
    }
});


// For Dropdown More Button Function Start
document.addEventListener("DOMContentLoaded", function () {
    const dropdownButton = document.querySelector(".dropbtn");
    const dropdownContent = document.querySelector(".dropdown-content");

    dropdownButton.addEventListener("click", function (event) {
        event.stopPropagation(); // Prevent event from bubbling up
        dropdownContent.classList.toggle("active");
    });

    // Close dropdown if clicked outside
    document.addEventListener("click", function (event) {
        if (!dropdownButton.contains(event.target) && !dropdownContent.contains(event.target)) {
            dropdownContent.classList.remove("active");
        }
    });
});

// For Dropdown More Button Function End
