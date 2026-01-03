// Reusable Header Component
function createHeader(activePage = '') {
    const header = document.createElement('header');
    header.className = 'header header-hero';

    header.innerHTML = `
        <div class="header-container">
            <div class="header-line"></div>
            <a href="index.html" class="logo logo-elegant">GRACEXPRESS |</a>
            <div class="header-center">
                <h1 class="header-title">ACERVO TÊXTIL DIGITAL</h1>
                <span class="header-subtitle">Biblioteca de Pesquisa</span>
            </div>
            <nav class="main-nav">
                <a href="sobre.html" class="nav-link ${activePage === 'sobre' ? 'active' : ''}" data-i18n="about">SOBRE</a>
                <a href="portfolio.html" class="nav-link ${activePage === 'portfolio' ? 'active' : ''}" data-i18n="portfolio">PORTFÓLIO</a>
                <a href="contato.html" class="nav-link ${activePage === 'contato' ? 'active' : ''}" data-i18n="contact">CONTATO</a>
            </nav>
        </div>
    `;

    return header;
}

// Insert header at the beginning of body
function initHeader(activePage = '') {
    const body = document.body;
    const header = createHeader(activePage);
    body.insertBefore(header, body.firstChild);
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createHeader, initHeader };
}
