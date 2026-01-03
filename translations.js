// Multilingual translations
const translations = {
    pt: {
        // Header
        portfolio: "Portfólio",
        about: "Sobre",
        contact: "Contato",
        // Hero
        heroTitle: "A Coleção de Tecidos",
        heroSubtitle: "Guia de Tecidos: descubra a origem, o toque e as tramas de cada material que dá vida ao vestuário.",
        heroCta: "EXPLORAR O ACERVO",
        // Search
        searchPlaceholder: "Pesquisar tecidos...",
        fabrics: "tecidos",
        // Filters
        filterTitle: "Filtrar por Tipo",
        allFabrics: "Todos os Tecidos",
        naturalFibers: "Fibras Naturais",
        artificialFibers: "Fibras Artificiais",
        syntheticFibers: "Fibras Sintéticas",
        knits: "Malhas",
        wovens: "Tecidos Planos",
        lightweight: "Tecidos Leves",
        luxury: "Tecidos Nobres",
        sportswear: "Esportivos",
        winterFabrics: "Outono/Inverno",
        structured: "Estruturados",
        // Slide labels
        sensoryCharacteristics: "Características Sensoriais",
        colorIntensity: "Intensidade de Cor",
        touchSoftness: "Toque e Maciez",
        thermalComfort: "Conforto Térmico",
        easyCare: "Facilidade de Cuidado",
        luminosity: "Luminosidade",
        composition: "Composição",
        structure: "Estrutura",
        finishing: "Acabamento",
        knowThisFabric: "Conheça Este Tecido",
        technicalSheet: "📐 Ficha Técnica",
        howToCare: "🧺 Como Cuidar",
        weight: "Gramatura",
        thickness: "Espessura",
        transparency: "Transparência",
        stretch: "Elasticidade",
        recommendedApps: "Aplicações Recomendadas",
        bestSeason: "Melhor Época para Uso",
        spring: "Primavera",
        summer: "Verão",
        autumn: "Outono",
        winter: "Inverno",
        fabric: "Tecido",
        of: "de",
        // Footer
        footerBrand: "Sua referência em tecidos para moda e confecção.",
        navigation: "Navegação",
        rights: "© 2024 GraceXpress. Todos os direitos reservados.",
        // Portfolio
        portfolioTitle: "Meu Portfólio",
        portfolioSubtitle: "Coleções e projetos de moda",
        portfolioItem1Title: "Coleção Verão 2024",
        portfolioItem1Phrase: "\"Fluidez que dança com a brisa\"",
        portfolioItem2Title: "Alta Costura",
        portfolioItem2Phrase: "\"Elegância atemporal em cada detalhe\"",
        portfolioItem3Title: "Desfile Paris 2024",
        portfolioItem3Phrase: "\"O movimento que inspira\"",
        portfolioItem4Title: "Alfaiataria Moderna",
        portfolioItem4Phrase: "\"Precisão que define caráter\"",
        portfolioItem5Title: "Coleção Inverno 2024",
        portfolioItem5Phrase: "\"Calor e sofisticação abraçados\"",
        portfolioItem6Title: "Moda Sustentável",
        portfolioItem6Phrase: "\"Consciência que veste bem\"",
        portfolioItem7Title: "Backstage Exclusivo",
        portfolioItem7Phrase: "\"A magia por trás da criação\"",
        portfolioItem8Title: "Linha Esportiva",
        portfolioItem8Phrase: "\"Performance com estilo\"",
        portfolioItem9Title: "Noite de Gala",
        portfolioItem9Phrase: "\"Brilho que encanta olhares\"",
        // Ad Bar
        ad1: "Anuncie Sua Marca Aqui",
        ad2: "Alcance Clientes Premium",
        ad3: "Sua Loja em Destaque",
        ad4: "Espaço Disponível"
    },
    en: {
        portfolio: "Portfolio",
        about: "About",
        contact: "Contact",
        heroTitle: "The Fabric Collection",
        heroSubtitle: "Fabric Guide: discover the origin, touch and weaves of each material that brings clothing to life.",
        heroCta: "EXPLORE THE COLLECTION",
        searchPlaceholder: "Search fabrics...",
        fabrics: "fabrics",
        filterTitle: "Filter by Type",
        allFabrics: "All Fabrics",
        naturalFibers: "Natural Fibers",
        artificialFibers: "Artificial Fibers",
        syntheticFibers: "Synthetic Fibers",
        knits: "Knits",
        wovens: "Woven Fabrics",
        lightweight: "Lightweight",
        luxury: "Luxury Fabrics",
        sportswear: "Sportswear",
        winterFabrics: "Fall/Winter",
        structured: "Structured",
        sensoryCharacteristics: "Sensory Characteristics",
        colorIntensity: "Color Intensity",
        touchSoftness: "Touch & Softness",
        thermalComfort: "Thermal Comfort",
        easyCare: "Easy Care",
        luminosity: "Luminosity",
        composition: "Composition",
        structure: "Structure",
        finishing: "Finishing",
        knowThisFabric: "About This Fabric",
        technicalSheet: "📐 Technical Specs",
        howToCare: "🧺 Care Guide",
        weight: "Weight",
        thickness: "Thickness",
        transparency: "Transparency",
        stretch: "Stretch",
        recommendedApps: "Recommended Applications",
        bestSeason: "Best Season",
        spring: "Spring",
        summer: "Summer",
        autumn: "Autumn",
        winter: "Winter",
        fabric: "Fabric",
        of: "of",
        footerBrand: "Your reference for fashion and textile fabrics.",
        navigation: "Navigation",
        rights: "© 2024 GraceXpress. All rights reserved.",
        // Portfolio
        portfolioTitle: "My Portfolio",
        portfolioSubtitle: "Fashion collections and projects",
        portfolioItem1Title: "Summer Collection 2024",
        portfolioItem1Phrase: "\"Fluidity that dances with the breeze\"",
        portfolioItem2Title: "Haute Couture",
        portfolioItem2Phrase: "\"Timeless elegance in every detail\"",
        portfolioItem3Title: "Paris Fashion Show 2024",
        portfolioItem3Phrase: "\"The movement that inspires\"",
        portfolioItem4Title: "Modern Tailoring",
        portfolioItem4Phrase: "\"Precision that defines character\"",
        portfolioItem5Title: "Winter Collection 2024",
        portfolioItem5Phrase: "\"Warmth and sophistication embraced\"",
        portfolioItem6Title: "Sustainable Fashion",
        portfolioItem6Phrase: "\"Consciousness that wears well\"",
        portfolioItem7Title: "Exclusive Backstage",
        portfolioItem7Phrase: "\"The magic behind creation\"",
        portfolioItem8Title: "Sportswear Line",
        portfolioItem8Phrase: "\"Performance with style\"",
        portfolioItem9Title: "Gala Night",
        portfolioItem9Phrase: "\"Brilliance that enchants\"",
        // Ad Bar
        ad1: "Advertise Your Brand Here",
        ad2: "Reach Premium Clients",
        ad3: "Your Store Highlighted",
        ad4: "Space Available",

    }
};

let currentLang = 'pt';

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    updatePageLanguage();
}

function updatePageLanguage() {
    const t = translations[currentLang];

    // Update data attributes for dynamic content
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            el.textContent = t[key];
        }
    });

    // Update placeholder attributes
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key]) {
            el.placeholder = t[key];
        }
    });
}

function getCurrentTranslations() {
    return translations[currentLang];
}

// Initialize language from localStorage
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('lang') || 'pt';
    currentLang = savedLang;
    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
        langSelect.value = savedLang;
        langSelect.addEventListener('change', (e) => setLanguage(e.target.value));
    }
    updatePageLanguage();
});
