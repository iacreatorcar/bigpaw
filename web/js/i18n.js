// file: web/js/i18n.js
let currentLang = localStorage.getItem('bigpaw_lang') || 'it';

const languageNames = {
    it: '🇮🇹 Italiano',
    en: '🇬🇧 English',
    es: '🇪🇸 Español',
    fr: '🇫🇷 Français',
    de: '🇩🇪 Deutsch',
    ja: '🇯🇵 日本語',
    zh: '🇨🇳 中文'
};

function changeLanguage(lang) {
    console.log('🔄 Cambio lingua in:', lang); // DEVE APPARIRE IN CONSOLE
    currentLang = lang;
    localStorage.setItem('bigpaw_lang', lang);
    updatePageText();
    updateLanguageDropdown();
}

function updatePageText() {
    console.log('Aggiornamento testi per lingua:', currentLang); // Debug
    
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[currentLang] && translations[currentLang][key]) {
            element.textContent = translations[currentLang][key];
        } else if (translations['it'] && translations['it'][key]) {
            element.textContent = translations['it'][key]; // fallback a italiano
        }
    });
    
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (translations[currentLang] && translations[currentLang][key]) {
            element.placeholder = translations[currentLang][key];
        } else if (translations['it'] && translations['it'][key]) {
            element.placeholder = translations['it'][key];
        }
    });
}

function updateLanguageDropdown() {
    const dropdownToggle = document.getElementById('languageDropdown');
    if (dropdownToggle) {
        dropdownToggle.innerHTML = `<i class="bi bi-globe2 me-1"></i> ${languageNames[currentLang] || 'Lingua'}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM caricato, inizializzo lingua:', currentLang);
    updatePageText();
    updateLanguageDropdown();
    
    // Aggiungi event listener a tutti i link del dropdown
    document.querySelectorAll('.dropdown-item[onclick^="changeLanguage"]').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = item.getAttribute('onclick').match(/'([^']+)'/)[1];
            changeLanguage(lang);
        });
    });
});

function t(key) {
    return translations[currentLang]?.[key] || translations['it'][key] || key;
}