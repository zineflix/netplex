    window.addEventListener("scroll", function () {
        let nav = document.querySelector("nav");
        if (window.scrollY > 30) {
            nav.classList.add("nav-solid");
        } else {
            nav.classList.remove("nav-solid");
        }
    });

    document.addEventListener("DOMContentLoaded", function () {
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

        getRandomRecommendations();
    });

    const apiKey = 'a1e72fd93ed59f56e6332813b9f8dcae';
    const apiUrl = 'https://api.themoviedb.org/3/';

    async function getRandomRecommendations() {
        const randomPage = Math.floor(Math.random() * 10) + 1;
        const randomMediaType = Math.random() > 0.5 ? 'movie' : 'tv';
        const url = `${apiUrl}discover/${randomMediaType}?api_key=${apiKey}&page=${randomPage}&language=en-US`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            displayResults(data.results);
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    }

    function displayResults(results) {
        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = '';

        results.forEach(item => {
            if (!item.poster_path) return;

            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item');

            const posterPath = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
            const title = item.title || item.name;
            const itemId = item.id;
            const mediaType = item.title ? 'movie' : 'tv';
            const dateStr = item.release_date || item.first_air_date || '';
            const year = dateStr ? dateStr.split('-')[0] : 'N/A';

            const targetUrl = mediaType === 'movie' 
                ? `movie-details.html?movie_id=${itemId}` 
                : `tvshows-details.html?id=${itemId}`;

            itemDiv.innerHTML = `
                <a href="${targetUrl}" tabindex="0">
                    <img src="${posterPath}" alt="${title}" loading="lazy">
                    <div class="item-info">
                        <div class="item-meta">
                            <span class="item-badge">${mediaType}</span>
                            <span class="item-year">${year}</span>
                        </div>
                        <div class="item-title">${title}</div>
                    </div>
                </a>
            `;

            resultsContainer.appendChild(itemDiv);
        });
    }

    // =========================================================
    // ANDROID TV D-PAD SPATIAL NAVIGATION & KEY HANDLER
    // =========================================================
    (function initTVNavigation() {
        function getFocusableElements() {
            return Array.from(document.querySelectorAll('a[href], button, input, [tabindex="0"]'))
                .filter(el => {
                    const rect = el.getBoundingClientRect();
                    const style = window.getComputedStyle(el);
                    return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
                });
        }

        function getCenter(rect) {
            return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        }

        function navigateSpatial(direction) {
            const focusables = getFocusableElements();
            const current = document.activeElement;

            if (!focusables.includes(current)) {
                if (focusables.length > 0) focusables[0].focus();
                return;
            }

            const currentRect = current.getBoundingClientRect();
            const currentCenter = getCenter(currentRect);

            let bestTarget = null;
            let minDistance = Infinity;

            focusables.forEach(target => {
                if (target === current) return;

                const targetRect = target.getBoundingClientRect();
                const targetCenter = getCenter(targetRect);

                let isDirectionMatch = false;
                let primaryDist = 0;
                let secondaryDist = 0;

                switch (direction) {
                    case 'ArrowLeft':
                        if (targetCenter.x < currentCenter.x - 5) {
                            isDirectionMatch = true;
                            primaryDist = currentCenter.x - targetCenter.x;
                            secondaryDist = Math.abs(currentCenter.y - targetCenter.y);
                        }
                        break;
                    case 'ArrowRight':
                        if (targetCenter.x > currentCenter.x + 5) {
                            isDirectionMatch = true;
                            primaryDist = targetCenter.x - currentCenter.x;
                            secondaryDist = Math.abs(currentCenter.y - targetCenter.y);
                        }
                        break;
                    case 'ArrowUp':
                        if (targetCenter.y < currentCenter.y - 5) {
                            isDirectionMatch = true;
                            primaryDist = currentCenter.y - targetCenter.y;
                            secondaryDist = Math.abs(currentCenter.x - targetCenter.x);
                        }
                        break;
                    case 'ArrowDown':
                        if (targetCenter.y > currentCenter.y + 5) {
                            isDirectionMatch = true;
                            primaryDist = targetCenter.y - currentCenter.y;
                            secondaryDist = Math.abs(currentCenter.x - targetCenter.x);
                        }
                        break;
                }

                if (isDirectionMatch) {
                    // Bias toward items aligned along the navigation direction
                    const score = primaryDist + (secondaryDist * 2.5);
                    if (score < minDistance) {
                        minDistance = score;
                        bestTarget = target;
                    }
                }
            });

            if (bestTarget) {
                bestTarget.focus();
                bestTarget.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
            }
        }

        window.addEventListener('keydown', function (e) {
            const tvKeyCodes = [19, 20, 21, 22, 23, 4, 8, 27, 13, 37, 38, 39, 40];
            
            // D-Pad Directionals
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) || (e.keyCode >= 19 && e.keyCode <= 22)) {
                e.preventDefault();
                let dir = e.key;
                if (e.keyCode === 19) dir = 'ArrowUp';
                if (e.keyCode === 20) dir = 'ArrowDown';
                if (e.keyCode === 21) dir = 'ArrowLeft';
                if (e.keyCode === 22) dir = 'ArrowRight';
                navigateSpatial(dir);
            }

            // D-Pad Select / Enter
            if (e.key === 'Enter' || e.keyCode === 13 || e.keyCode === 23) {
                if (document.activeElement) {
                    document.activeElement.click();
                }
            }

            // TV Back Button / Esc
            if (e.key === 'Escape' || e.key === 'GoBack' || e.keyCode === 4 || e.keyCode === 8 || e.keyCode === 27 || e.keyCode === 10009) {
                const mobileMoreMenu = document.getElementById('mobile-more-menu');
                if (mobileMoreMenu && mobileMoreMenu.classList.contains('show')) {
                    e.preventDefault();
                    mobileMoreMenu.classList.remove('show');
                }
            }
        });
    })();
