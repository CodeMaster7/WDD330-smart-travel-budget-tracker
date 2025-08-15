// Purpose: tiny generic helpers used across the app.

// wrapper for querySelector...returns matching element
export function qs(selector, parent=document) {
    return parent.querySelector(selector);
}

// retrieve data from localStorage (parsed)
export function getLocalStorage(key) {
    try {
        const raw=localStorage.getItem(key);
        return raw ? JSON.parse(raw): null;
    }

    catch (e) {
        return e.Error || null;
    }
}

// save data to localStorage (stringified)
export function setLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    }

    catch (e) {
        return e.Error || null;
    }
}

// set a listener for both touchend and click
export function setClick(selector, callback) {
    const el=qs(selector);
    if ( !el) return;

    el.addEventListener('touchend', (event)=> {
            event.preventDefault();
            callback(event);
        }

    );
    el.addEventListener('click', callback);
}

export function getParam(param) {
    const urlParams=new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// fetch HTML content from a given path (served from /public)
export async function loadTemplate(path) {
    const response=await fetch(path);

    if ( !response.ok) {
        throw new Error(`HTTP error ! Status: $ {
                response.status
            }

            `);
    }

    return response.text();
}

// render content into a parent element (overwrites content)
export function renderWithTemplate(template, parentElement) {
    parentElement.innerHTML=template;
}

// render lists fast by joining HTML strings
export function renderListWithTemplate(templateFn,
    parentElement,
    list,
    position='afterbegin',
    clear=false,
) {
    const htmlStrings=list.map(templateFn);
    if (clear) parentElement.innerHTML='';
    parentElement.insertAdjacentHTML(position, htmlStrings.join(''));
}

// lightweight alert helper that prepends to <main>
export function alertMessage(message, scroll=true) {
    const alert=document.createElement('div');
    alert.classList.add('alert');

    alert.innerHTML=` <span class="alert-message">$ {
        message
    }

    </span><button type="button"class="alert-close">X</button>`;
    const main=document.querySelector('main') || document.body;

    alert.addEventListener('click', function (e) {
            if (e.target.tagName==='BUTTON'&& e.target.classList.contains('alert-close')) {
                e.preventDefault();
                e.stopPropagation();
                this.remove();
            }
        }

    );
    main.prepend(alert);
    if (scroll) window.scrollTo(0, 0);
}

// load header and footer from public/partials
export async function loadHeaderFooter() {
    const headerPath=assetUrl('partials/header.html');
    const footerPath=assetUrl('partials/footer.html');
    const [headerTemplate,
    footerTemplate]=await Promise.all([ loadTemplate(headerPath),
        loadTemplate(footerPath),
        ]);
    const headerElement=document.getElementById('main-header');
    const footerElement=document.getElementById('main-footer');
    if (headerElement) renderWithTemplate(headerTemplate, headerElement);
    if (footerElement) renderWithTemplate(footerTemplate, footerElement);

    // Wire mobile nav toggle after header renders
    const btn=document.getElementById('nav-menu');
    const nav=document.getElementById('nav');

    if (btn && nav) {
        btn.addEventListener('click', ()=> {
                nav.classList.toggle('site-header__nav--open');
            }

        );
    }
}

// Build a URL that respects the deployed base path set by Vite
export function assetUrl(path) {
    const baseUrl=import.meta?.env?.BASE_URL || '/';
    const relative=path.startsWith('/') ? path.slice(1): path;

    return `$ {
        baseUrl
    }

    $ {
        relative
    }

    `;
}