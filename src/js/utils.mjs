// Purpose: tiny generic helpers used across the app.

// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
    return parent.querySelector(selector);
}

// retrieve data from localStorage (parsed)
export function getLocalStorage(key) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        return e.Error || null;
    }
}

// save data to localStorage (stringified)
export function setLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        return e.Error || null;
    }
}

// set a listener for both touchend and click
export function setClick(selector, callback) {
    const el = qs(selector);
    if (!el) return;

    el.addEventListener('touchend', (event) => {
        event.preventDefault();
        callback(event);
    });
    el.addEventListener('click', callback);
}

export function getParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// fetch HTML content from a given path (served from /public)
export async function loadTemplate(path) {
    const response = await fetch(path);

    if (!response.ok) {
        throw new Error(`HTTP error ! Status: $ {
                response.status
            }

            `);
    }

    return response.text();
}

// render content into a parent element (overwrites content)
export function renderWithTemplate(template, parentElement) {
    parentElement.innerHTML = template;
}

// render lists fast by joining HTML strings
export function renderListWithTemplate(
    templateFn,
    parentElement,
    list,
    position = 'afterbegin',
    clear = false,
) {
    const htmlStrings = list.map(templateFn);
    if (clear) parentElement.innerHTML = '';
    parentElement.insertAdjacentHTML(position, htmlStrings.join(''));
}

// lightweight alert helper that prepends to <main>
export function alertMessage(message, scroll = true) {
    const alert = document.createElement('div');
    alert.classList.add('alert');

    alert.innerHTML = `<span class="alert-message">${message}</span><button type="button" class="alert-close">X</button>`;
    const main = document.querySelector('main') || document.body;

    alert.addEventListener('click', function (e) {
        if (
            e.target.tagName === 'BUTTON' &&
            e.target.classList.contains('alert-close')
        ) {
            e.preventDefault();
            e.stopPropagation();

            // Add removing class to trigger animation
            this.classList.add('alert--removing');

            // Remove element after animation completes
            setTimeout(
                () => {
                    if (this.parentNode) {
                        this.remove();
                    }
                },

                500,
            ); // Match the CSS transition duration
        }
    });
    main.prepend(alert);
    if (scroll) window.scrollTo(0, 0);

    // Auto-dismiss alert after 5 seconds
    setTimeout(
        () => {
            if (alert.parentNode) {
                // Add removing class to trigger animation
                alert.classList.add('alert--removing');

                // Remove element after animation completes
                setTimeout(
                    () => {
                        if (alert.parentNode) {
                            alert.remove();
                        }
                    },

                    500,
                ); // Match the CSS transition duration
            }
        },

        5000,
    );
}

// load header and footer from public/partials
export async function loadHeaderFooter() {
    const headerPath = assetUrl('partials/header.html');
    const footerPath = assetUrl('partials/footer.html');
    const [headerTemplate, footerTemplate] = await Promise.all([
        loadTemplate(headerPath),
        loadTemplate(footerPath),
    ]);
    const headerElement = document.getElementById('main-header');
    const footerElement = document.getElementById('main-footer');
    if (headerElement) renderWithTemplate(headerTemplate, headerElement);
    if (footerElement) renderWithTemplate(footerTemplate, footerElement);

    // Wire mobile nav toggle after header renders
    setupMobileNav();
}

// Setup mobile navigation with proper event handling
function setupMobileNav() {
    const btn = document.getElementById('nav-menu');
    const nav = document.getElementById('nav');

    if (btn && nav) {
        // Determine screen size and set appropriate classes
        const isMobile = window.innerWidth < 768;
        const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
        const isDesktop = window.innerWidth >= 1024;

        // Remove all responsive classes first
        nav.classList.remove(
            'site-header__nav--mobile',
            'site-header__nav--desktop',
        );
        btn.classList.remove('site-header__menu--hidden');

        if (isMobile) {
            // Mobile: dropdown navigation
            nav.classList.add('site-header__nav--mobile');

            // Remove any existing listeners to prevent duplicates
            btn.removeEventListener('click', btn._navToggleHandler);

            // Create a new handler function
            btn._navToggleHandler = () => {
                nav.classList.toggle('site-header__nav--open');
            };

            // Add the new listener
            btn.addEventListener('click', btn._navToggleHandler);

            // Ensure menu starts closed
            nav.classList.remove('site-header__nav--open');

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!nav.contains(e.target) && !btn.contains(e.target)) {
                    nav.classList.remove('site-header__nav--open');
                }
            });
        } else {
            // Tablet/Desktop: horizontal navigation
            nav.classList.add('site-header__nav--desktop');
            btn.classList.add('site-header__menu--hidden');

            // Remove mobile handlers
            nav.classList.remove('site-header__nav--open');
            btn.removeEventListener('click', btn._navToggleHandler);
        }

        // Add resize listener to handle screen size changes
        window.addEventListener('resize', () => {
            setupMobileNav();
        });
    }
}

// Build a URL that respects the deployed base path set by Vite
export function assetUrl(path) {
    const baseUrl = import.meta?.env?.BASE_URL || '/';
    const relative = path.startsWith('/') ? path.slice(1) : path;

    return `${baseUrl}${relative}`;
}
