// For Responsive Header
window.addEventListener("scroll", function () {
    let nav = document.querySelector("nav");
    if (window.scrollY > 50) {
        nav.classList.add("nav-solid");
    } else {
        nav.classList.remove("nav-solid");
    }
});

// Dropdown and Mobile Navigation Menus
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

    const dropdownButton = document.querySelector(".dropbtn");
    const dropdownContent = document.querySelector(".dropdown-content");
    if (dropdownButton && dropdownContent) {
        dropdownButton.addEventListener("click", function (event) {
            event.stopPropagation();
            dropdownContent.classList.toggle("active");
        });

        document.addEventListener("click", function (event) {
            if (!dropdownButton.contains(event.target) && !dropdownContent.contains(event.target)) {
                dropdownContent.classList.remove("active");
            }
        });
    }
});

/* =========================================================
   ANDROID TV REMOTE CONTROL & WHOLE-PAGE D-PAD NAVIGATION
========================================================= */
(function setupAndroidTVNavigation() {
    function getFocusableElements() {
        const selector = [
            'button:not([disabled])',
            '[href]',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])',
            '.about-section p',
            '.contact-info-item',
            '.footer-links a'
        ].join(', ');

        return Array.from(document.querySelectorAll(selector)).filter(el => {
            const style = window.getComputedStyle(el);
            if (style.display === 'none' || style.visibility === 'hidden') return false;
            return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
        });
    }

    function getCenter(rect) {
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    }

    function findNextElement(currentEl, direction) {
        const elements = getFocusableElements().filter(el => el !== currentEl && !currentEl.contains(el));
        const currentRect = currentEl.getBoundingClientRect();
        const currentCenter = getCenter(currentRect);

        let bestCandidate = null;
        let shortestDistance = Infinity;

        elements.forEach(candidate => {
            const rect = candidate.getBoundingClientRect();
            const center = getCenter(rect);

            const dx = center.x - currentCenter.x;
            const dy = center.y - currentCenter.y;

            let isInDirection = false;
            let primaryDist = 0;
            let secondaryDist = 0;

            switch (direction) {
                case 'up':
                    isInDirection = dy < -4;
                    primaryDist = Math.abs(dy);
                    secondaryDist = Math.abs(dx);
                    break;
                case 'down':
                    isInDirection = dy > 4;
                    primaryDist = Math.abs(dy);
                    secondaryDist = Math.abs(dx);
                    break;
                case 'left':
                    isInDirection = dx < -4;
                    primaryDist = Math.abs(dx);
                    secondaryDist = Math.abs(dy);
                    break;
                case 'right':
                    isInDirection = dx > 4;
                    primaryDist = Math.abs(dx);
                    secondaryDist = Math.abs(dy);
                    break;
            }

            if (isInDirection) {
                const distance = primaryDist * 1.0 + secondaryDist * 2.0;
                if (distance < shortestDistance) {
                    shortestDistance = distance;
                    bestCandidate = candidate;
                }
            }
        });

        return bestCandidate;
    }

    window.addEventListener('keydown', function (e) {
        const key = e.key;
        const code = e.keyCode;

        const isUp = key === 'ArrowUp' || code === 38 || code === 19;
        const isDown = key === 'ArrowDown' || code === 40 || code === 20;
        const isLeft = key === 'ArrowLeft' || code === 37 || code === 21;
        const isRight = key === 'ArrowRight' || code === 39 || code === 22;
        const isSelect = key === 'Enter' || code === 13 || code === 23 || code === 66;
        const isBack = key === 'Escape' || key === 'Back' || code === 27 || code === 461 || code === 10009;

        // Dismiss open dropdown/mobile menu on Back key
        if (isBack) {
            const dropdownContent = document.querySelector('.dropdown-content.active');
            const mobileMenu = document.querySelector('.mobile-more-menu.show');
            if (dropdownContent) {
                e.preventDefault();
                dropdownContent.classList.remove('active');
                return;
            }
            if (mobileMenu) {
                e.preventDefault();
                mobileMenu.classList.remove('show');
                return;
            }
        }

        let activeEl = document.activeElement;
        const focusable = getFocusableElements();

        // Default initial focus on the first interactive remote button press
        if (!activeEl || !focusable.includes(activeEl) || activeEl === document.body) {
            if (isUp || isDown || isLeft || isRight || isSelect) {
                e.preventDefault();
                const startElement = document.querySelector('nav .desktop-menu a') || 
                                     document.getElementById('logo-link');
                if (startElement) {
                    startElement.focus({ preventScroll: true });
                }
                return;
            }
        }

        // Allow textarea editing navigation without trapping
        if (activeEl.tagName.toLowerCase() === 'textarea') {
            if ((isLeft || isRight) && !e.altKey && !e.ctrlKey) {
                return;
            }
        }

        let direction = null;
        if (isUp) direction = 'up';
        else if (isDown) direction = 'down';
        else if (isLeft) direction = 'left';
        else if (isRight) direction = 'right';

        if (direction) {
            const nextEl = findNextElement(activeEl, direction);
            if (nextEl) {
                e.preventDefault();
                nextEl.focus();
                nextEl.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
            }
        } else if (isSelect) {
            // If selecting a contact info card with an inner link, click the link
            if (activeEl.classList.contains('contact-info-item')) {
                const innerLink = activeEl.querySelector('a');
                if (innerLink) {
                    e.preventDefault();
                    innerLink.click();
                }
            }
        }
    });

    // Ensure the viewport always loads pinned at the very top
    window.addEventListener('DOMContentLoaded', () => {
        window.scrollTo(0, 0);
    });

    window.addEventListener('load', () => {
        setTimeout(() => {
            const topTarget = document.querySelector('nav .desktop-menu a') ||
                              document.getElementById('logo-link');
            if (topTarget) {
                topTarget.focus({ preventScroll: true });
            }
            window.scrollTo(0, 0);
        }, 50);
    });
})();
