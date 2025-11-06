// ====================================================================
// === CONTROL DE CONFIGURACIÓN Y VARIABLES GLOBALES ===
// ====================================================================

const DEBUG_MODE = false; 
let isChristmasForTesting = false; // Debe ser 'let' si se modifica en Debug

// Fechas para 2026 (Fechas de fin de curso más comunes en España - ESO / 1º Bach)
const TARGET_DATE_DEFAULT = new Date('2026-06-21T15:00:00').getTime(); // Fecha por defecto (21 Junio)
const DATE_BACH = new Date('2026-05-20T15:00:00').getTime();         // 2º Bachillerato (Finales)
const DATE_RECUP = new Date('2026-07-01T15:00:00').getTime();        // Recuperaciones (Finales)

// Fechas aproximadas de Fin de Curso (ESO / 1º Bach) por CCAA para 2025/2026
// Se asume un horario de 15:00:00 para el fin.
const CCAA_DATES = {
    'AND': {name: 'Andalucía', date: '2026-06-23T15:00:00'},
    'ARA': {name: 'Aragón', date: '2026-06-21T15:00:00'},
    'AST': {name: 'Asturias', date: '2026-06-21T15:00:00'},
    'BAL': {name: 'Islas Baleares', date: '2026-06-22T15:00:00'},
    'CAN': {name: 'Islas Canarias', date: '2026-06-20T15:00:00'},
    'CANT': {name: 'Cantabria', date: '2026-06-24T15:00:00'},
    'CYL': {name: 'Castilla y León', date: '2026-06-21T15:00:00'},
    'CLM': {name: 'Castilla-La Mancha', date: '2026-06-21T15:00:00'},
    'CAT': {name: 'Cataluña', date: '2026-06-20T15:00:00'},
    'MAD': {name: 'Comunidad de Madrid', date: '2026-06-21T15:00:00'},
    'VAL': {name: 'Comunidad Valenciana', date: '2026-06-18T15:00:00'},
    'EXT': {name: 'Extremadura', date: '2026-06-20T15:00:00'},
    'GAL': {name: 'Galicia', date: '2026-06-20T15:00:00'},
    'RIO': {name: 'La Rioja', date: '2026-06-23T15:00:00'},
    'MUR': {name: 'Región de Murcia', date: '2026-06-24T15:00:00'},
    'NAV': {name: 'Comunidad Foral de Navarra', date: '2026-06-17T15:00:00'},
    'EUS': {name: 'País Vasco', date: '2026-06-19T15:00:00'}
};


// ====================================================================
// === CONFIGURACIÓN DE PERSONALIZACIÓN (FUENTES) ===
// ====================================================================

const AVAILABLE_FONTS = {
    'Arial (Default)': { 
        name: 'Arial', 
        url: '', // Fuente de sistema, no necesita carga
        fallback: 'sans-serif'
    },
    'Montserrat': { 
        name: 'Montserrat', 
        url: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap',
        fallback: 'sans-serif'
    },
    'Roboto Mono': { 
        name: 'Roboto Mono', 
        url: 'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@700&display=swap',
        fallback: 'monospace'
    },
    'Handwritten': { 
        name: 'Shadows Into Light', 
        url: 'https://fonts.googleapis.com/css2?family=Shadows+Into+Light&display=swap',
        fallback: 'cursive'
    },
    'Retro (8-bit)': { 
        name: '8bitOperatorPlus-Bold', 
        url: '', // Ya cargada en base.css
        fallback: 'monospace'
    },
    'Tecno-Gaming': { 
        name: 'Rajdhani', 
        url: 'https://fonts.googleapis.com/css2?family=Rajdhani:wght@700&display=swap',
        fallback: 'sans-serif'
    },
    'Impacto': { 
        name: 'Bebas Neue', 
        url: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap',
        fallback: 'sans-serif'
    }
};

const LOCAL_STORAGE_FONT_KEY = 'countdown_font_preference';

let currentTargetDate = TARGET_DATE_DEFAULT;
let countdownIntervalId;