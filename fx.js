// Dependencias: config.js, dom_refs.js, countdown.js

// PUTO CÓDIGO INSUFRIBLE 😭😭🙏

// ====================================================================
// === VARIABLES DE ESTACIÓN FORZADA ===
// ====================================================================
let forcedSeason = null; // 'navidad', 'otoño', o null para automático

// ====================================================================
// === GESTIÓN DE PERSONALIZACIÓN (FUENTES) ===
// ====================================================================

function loadGoogleFont(fontName, fontUrl) {
    if (!fontUrl) return; 

    // === CORRECCIÓN CRÍTICA: NO INTENTAR CARGAR ARCHIVOS BINARIOS COMO CSS ===
    // Si la URL termina en .woff o .ttf, asumimos que se carga por @font-face en base.css.
    if (fontUrl.endsWith('.woff') || fontUrl.endsWith('.ttf')) {
        return; 
    }
    // ========================================================================
    
    // Si la fuente ya está en la cabecera, salimos.
    if (document.querySelector(`link[data-font-name="${fontName}"]`)) {
        return;
    }
    
    // Cargamos la fuente de Google Fonts dinámicamente
    let link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = fontUrl;
    link.dataset.fontName = fontName; 
    document.head.appendChild(link);
}

function applyFont(fontKey) {
    const fontData = AVAILABLE_FONTS[fontKey];
    if (!fontData) return;
    
    const newFontFamily = `'${fontData.name}', ${fontData.fallback}`;

    // 1. Aplicar la fuente al body (base para toda la herencia)
    document.body.style.fontFamily = newFontFamily;
    
    // 2. CORRECCIÓN DEFINITIVA: Forzar la fuente directamente en los elementos
    //    críticos que no están heredando (títulos y números del contador).
    
    // Título y Subtítulo
    const pageTitle = document.getElementById('pageTitle');
    const pageSubtitle = document.getElementById('pageSubtitle');

    if (pageTitle) pageTitle.style.fontFamily = newFontFamily;
    if (pageSubtitle) pageSubtitle.style.fontFamily = newFontFamily;
    
    // Números del contador (usamos las referencias globales que YA están cargadas)
    if (daysSpan) daysSpan.style.fontFamily = newFontFamily;
    if (hoursSpan) hoursSpan.style.fontFamily = newFontFamily;
    if (minutesSpan) minutesSpan.style.fontFamily = newFontFamily;
    if (secondsSpan) secondsSpan.style.fontFamily = newFontFamily;
}

function saveFontPreference(fontKey) {
    try {
        localStorage.setItem(LOCAL_STORAGE_FONT_KEY, fontKey);
    } catch (e) {
        console.warn("No se pudo guardar la preferencia de fuente en localStorage:", e);
    }
}

function loadFontPreference() {
    let fontKey = 'Arial (Default)'; 
    try {
        const storedKey = localStorage.getItem(LOCAL_STORAGE_FONT_KEY);
        if (storedKey && AVAILABLE_FONTS[storedKey]) {
            fontKey = storedKey;
        }
    } catch (e) {
        console.error("Error al cargar la preferencia de fuente:", e);
    }
    
    const fontData = AVAILABLE_FONTS[fontKey];
    loadGoogleFont(fontData.name, fontData.url); 
    applyFont(fontKey);
    return fontKey;
}

// ====================================================================
// === GESTIÓN DE SPLASH TEXTS (MODIFICADO) ===
// ====================================================================

const SPLASH_COLORS = ['milestone-red', 'milestone-green', 'milestone-blue', 'milestone-yellow', 'milestone-purple'];

// MODIFICADO: Hacer la función global para que sea accesible desde el debug
function setInitialSplashText() {
    if (!milestoneSplash || SPLASH_TEXTS.length === 0) return;
    
    // 1. Elegir texto de forma aleatoria
    const randomIndex = Math.floor(Math.random() * SPLASH_TEXTS.length);
    const text = SPLASH_TEXTS[randomIndex];
    
    // 2. Elegir un color de forma aleatoria
    const randomColorClass = SPLASH_COLORS[Math.floor(Math.random() * SPLASH_COLORS.length)];
    
    // 3. Limpiar clases de color anteriores
    milestoneSplash.className = milestoneSplash.className.replace(/milestone-(red|green|blue|yellow|purple)/g, '');
    
    // 4. Aplicar la nueva clase de color y mostrar
    milestoneSplash.classList.add(randomColorClass);
    milestoneSplash.textContent = text;
    milestoneSplash.classList.remove('milestone-hidden');
    
    console.log("🎯 Splash text cambiado:", text);
}

// ====================================================================
// === FECHA ACTUAL Y DÍA/NOCHE ===
// ====================================================================

// MODIFICADO: Acepta un timestamp para forzar la fecha (desde el debug)
function updateCurrentDate(timestamp = null) {
    if (!currentDateDisplay) return;

    // Usa el timestamp (si existe) o la fecha real
    const now = timestamp ? new Date(timestamp) : new Date();
    
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = now.toLocaleDateString('es-ES', options); 
    
    try {
        const parts = formattedDate.split(' '); 
        const dayName = parts[0].replace(',', '').charAt(0).toUpperCase() + parts[0].slice(1).replace(',', '');
        const monthIndex = parts.indexOf('de') + 1;
        const monthName = parts[monthIndex].charAt(0).toUpperCase() + parts[monthIndex].slice(1);
        
        currentDateDisplay.textContent = `${dayName}, ${parts[1]} ${monthName} ${parts[parts.length - 1]}`;
    } catch (e) {
        currentDateDisplay.textContent = now.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
    }
}


// Lógica del Sol/Luna (Sin cambios)
function updateDayNightIcon() {
    if (!dayNightIcon) return;
    
    const hour = new Date().getHours();
    const isDay = hour >= 7 && hour < 20;

    if (isDay) {
        dayNightIcon.innerHTML = '<i class="fa-solid fa-sun"></i>';
        dayNightIcon.classList.add('day');
        dayNightIcon.classList.remove('night');
    } else {
        dayNightIcon.innerHTML = '<i class="fa-solid fa-moon"></i>';
        dayNightIcon.classList.add('night');
        dayNightIcon.classList.remove('day');
    }
}


// ====================================================================
// === GESTIÓN DE FECHAS Y SUBTÍTULO ===
// ====================================================================

function updateSubtitle(timestamp, dateKey) {
    const subtitle = document.getElementById('pageSubtitle');
    if (!subtitle) return;
    
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.toLocaleString('es-ES', { month: 'long' });
    const year = date.getFullYear();
    
    const formattedMonth = month.charAt(0).toUpperCase() + month.slice(1);
    
    let prefix = '';
    
    subtitle.textContent = prefix + `${day} de ${formattedMonth} de ${year}`;
}

function setActiveButton(element) {
    document.querySelectorAll('.date-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.ccaa-button').forEach(btn => btn.classList.remove('active'));
    
    if (element) {
        element.classList.add('active');
    }
}

function setupCcaaSelector() {
    let htmlContent = '';
    for (const code in CCAA_DATES) {
        const data = CCAA_DATES[code];
        htmlContent += `<button class="ccaa-button" data-key="CCAA_${code}">${data.name}</button>`;
    }
    ccaaSelector.innerHTML = htmlContent;

    ccaaSelector.addEventListener('click', (event) => {
        const button = event.target.closest('.ccaa-button');
        if (!button) return;

        const ccaaKey = button.getAttribute('data-key').split('_')[1];
        const newTargetDate = new Date(CCAA_DATES[ccaaKey].date).getTime();
        
        currentTargetDate = newTargetDate;
        startCountdown();
        updateSubtitle(newTargetDate, button.getAttribute('data-key'));
        
        setActiveButton(document.querySelector('.date-button[data-key="ccaa"]'));
        button.classList.add('active'); 
        
        ccaaSelector.classList.add('hidden');
    });
}


function setupDateSelectors() {
    if (!dateSelectorsContainer) return;
    
    setupCcaaSelector();

    dateSelectorsContainer.addEventListener('click', (event) => {
        const button = event.target.closest('.date-button');
        if (!button) return;
        
        const dateKey = button.getAttribute('data-key');
        let newTargetDate = null;
        
        ccaaSelector.classList.add('hidden'); 
        
        switch(dateKey) {
            case 'bach':
                newTargetDate = DATE_BACH;
                break;
            case 'recup':
                newTargetDate = DATE_RECUP;
                break;
            case 'ccaa':
                ccaaSelector.classList.remove('hidden');
                setActiveButton(button);
                return; 
            default:
                newTargetDate = TARGET_DATE_DEFAULT;
        }

        if (newTargetDate !== null) {
             currentTargetDate = newTargetDate;
             startCountdown();
             updateSubtitle(newTargetDate, dateKey);
             setActiveButton(button);
        }
    });

    const defaultButton = document.querySelector('.date-button[data-key="ccaa"]');
    if (defaultButton) {
        setActiveButton(defaultButton);
        updateSubtitle(TARGET_DATE_DEFAULT, 'default');
    }
}


// ====================================================================
// === GENERADOR DE PARTÍCULAS DE NIEVE (Función original) ===
// ====================================================================

function createSnowflakes(num) {
    const container = document.getElementById('particles-js');
    if (!container) return; 

    container.innerHTML = ''; 
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

    for (let i = 0; i < num; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.style.left = Math.random() * vw + 'px';
        snowflake.style.animationDuration = Math.random() * 10 + 5 + 's';
        snowflake.style.animationDelay = Math.random() * -10 + 's';
        const size = Math.random() * 5 + 3;
        snowflake.style.width = size + 'px';
        snowflake.style.height = size + 'px';
        
        container.appendChild(snowflake);
    }
}

// ====================================================================
// === GENERADOR DE HOJAS DE OTOÑO ===
// ====================================================================

function createAutumnLeaves(num) {
    const container = document.getElementById('particles-js');
    if (!container) return; 

    container.innerHTML = ''; 
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

    const leafVariations = ['🍂', '🍁', '🥮']; // Diferentes tipos de hojas/otoño

    for (let i = 0; i < num; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'autumn-leaf';
        leaf.textContent = leafVariations[Math.floor(Math.random() * leafVariations.length)];
        
        // Posición inicial aleatoria en la parte superior
        leaf.style.left = Math.random() * vw + 'px';
        leaf.style.fontSize = (Math.random() * 20 + 15) + 'px'; // Tamaños entre 15px y 35px
        
        // Animación diagonal hacia la derecha
        const animationDuration = Math.random() * 15 + 10 + 's'; // Entre 10 y 25 segundos
        
        leaf.style.animation = `fallDiagonal ${animationDuration} linear infinite`;
        leaf.style.animationDelay = Math.random() * -20 + 's';
        
        // Rotación aleatoria para efecto más natural
        leaf.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        container.appendChild(leaf);
    }
}

// ====================================================================
// === LIMPIAR PARTÍCULAS ===
// ====================================================================

function clearParticles() {
    const particlesContainer = document.getElementById('particles-js');
    if(particlesContainer) {
        particlesContainer.innerHTML = '';
    }
}

// ====================================================================
// === SELECTOR DE FUENTES (LÓGICA CORREGIDA) ===
// ====================================================================

document.addEventListener('DOMContentLoaded', function() {
    const fontToggle = document.getElementById('fontToggle');
    const fontPanel = document.getElementById('fontPanel');
    const fontOptions = document.querySelectorAll('.font-option');
    
    // Función para actualizar el botón activo
    function setActiveFontOption(selectedKey) {
        fontOptions.forEach(opt => {
            if (opt.getAttribute('data-font') === selectedKey) {
                opt.classList.add('active');
            } else {
                opt.classList.remove('active');
            }
        });
    }

    // Cargar la fuente guardada y marcarla como activa
    try {
        const storedKey = localStorage.getItem(LOCAL_STORAGE_FONT_KEY);
        if (storedKey && AVAILABLE_FONTS[storedKey]) {
            setActiveFontOption(storedKey);
        } else {
            setActiveFontOption('Arial (Default)');
        }
    } catch (e) {}
    
    // Toggle del panel
    fontToggle.addEventListener('click', function() {
        fontPanel.classList.toggle('active');
    });
    
    // --- LÓGICA DE SELECCIÓN CORREGIDA ---
    fontOptions.forEach(option => {
        option.addEventListener('click', function() {
            // 1. Obtener la CLAVE (ej: "Retro (8-bit)")
            const fontKey = this.getAttribute('data-font');
            
            // 2. Marcar como activo
            setActiveFontOption(fontKey);
            
            // 3. ¡LLAMAR A LAS FUNCIONES CORRECTAS!
            applyFont(fontKey);
            saveFontPreference(fontKey);
            
            // 4. Cerrar panel después de seleccionar
            setTimeout(() => {
                fontPanel.classList.remove('active');
            }, 300);
        });
    });
    
    // Cerrar al hacer click fuera
    document.addEventListener('click', function(e) {
        if (!fontToggle.contains(e.target) && !fontPanel.contains(e.target)) {
            fontPanel.classList.remove('active');
        }
    });
});


// ====================================================================
// === NOTIFICACIÓN DE ESTACIÓN ===
// ====================================================================

function getCurrentSeason() {
    const today = new Date();
    const month = today.getMonth();
    
    if (month >= 2 && month <= 4) return 'primavera';
    if (month >= 5 && month <= 7) return 'verano';
    if (month >= 8 && month <= 10) return 'otoño';
    return 'invierno';
}

function getSeasonEmoji(season) {
    const emojis = {
        'primavera': '🌸',
        'verano': '☀️',
        'otoño': '🍂',
        'invierno': '❄️'
    };
    return emojis[season] || '🎉';
}

function getSeasonMessage(season) {
    const messages = {
        'primavera': '¡Ha llegado la primavera! Las flores florecen...',
        'verano': '¡Es verano! Disfruta del sol...',
        'otoño': 'El otoño ha llegado... Las hojas caen...',
        'invierno': '¡Es invierno! La nieve cae suavemente...'
    };
    return messages[season] || `Es ${season}...`;
}

// MODIFICADO: Notificación con estación forzada y mejoras visuales
function showSeasonNotification(forcedSeason = null) {
    let season, emoji, message, color, borderColor;
    
    if (forcedSeason === 'navidad') {
        season = 'navidad';
        emoji = '🎄';
        message = '¡Navidad forzada! ¡Disfruta de la nieve!';
        color = '#b3e0ff'; // Celeste para navidad
        borderColor = '#4da6ff'; // Azul más oscuro para borde
    } else if (forcedSeason === 'otoño') {
        season = 'otoño';
        emoji = '🍂';
        message = '¡Otoño forzado! Las hojas caen...';
        color = '#ffb366'; // Naranja para otoño
        borderColor = '#ff8000'; // Naranja oscuro para borde
    } else {
        season = getCurrentSeason();
        emoji = getSeasonEmoji(season);
        message = getSeasonMessage(season);
        
        // Colores por estación automática
        const seasonColors = {
            'primavera': { color: '#ff66b2', border: '#ff1a8c' }, // Rosa
            'verano': { color: '#ffff66', border: '#ffcc00' },    // Amarillo
            'otoño': { color: '#ffb366', border: '#ff8000' },     // Naranja
            'invierno': { color: '#b3e0ff', border: '#4da6ff' }   // Celeste
        };
        
        const seasonColor = seasonColors[season] || { color: '#e5ff00', border: '#b3c500' };
        color = seasonColor.color;
        borderColor = seasonColor.border;
    }
    
    // Crear el elemento de notificación
    const notification = document.createElement('div');
    notification.id = 'seasonNotification';
    notification.innerHTML = `${emoji} ${message}`;
    
    // Aplicar estilos mejorados
    notification.style.cssText = `
        position: fixed;
        bottom: -100px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.85);
        color: ${color};
        padding: 12px 25px;
        border-radius: 20px;
        font-size: 1.1em;
        font-weight: bold;
        z-index: 1000;
        white-space: nowrap;
        border: 2px solid ${borderColor};
        box-shadow: 0 0 25px ${borderColor}80;
        backdrop-filter: blur(15px);
        transition: bottom 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        text-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
    `;
    
    // Añadir al DOM
    document.body.appendChild(notification);
    
    // Forzar reflow para asegurar la animación
    notification.offsetHeight;
    
    // Animación mejorada - más rápida y smooth
    setTimeout(() => {
        // Subir con easing mejorado
        notification.style.bottom = '30px';
        
        // Esperar menos tiempo y bajar
        setTimeout(() => {
            notification.style.bottom = '-100px';
            
            // Eliminar del DOM después de la animación
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 600);
        }, 2000); // Solo 2 segundos visible (antes 3)
    }, 50); // Delay reducido a 50ms (antes 100ms)
}

// ====================================================================
// === GESTIÓN DE CONTENIDO ESTACIONAL (NAVIDAD, OTOÑO Y MÚSICA) ===
// ====================================================================

// MODIFICADO: Lógica de contenido estacional con estación forzada y limpieza
function manageSeasonalContent(shouldKeepPlaying = false) {
    const today = new Date();
    const month = today.getMonth(); 
    const day = today.getDate();
    
    // Lógica con estación forzada
    let isChristmasEventActive, isAutumn;
    
    if (forcedSeason === 'navidad') {
        isChristmasEventActive = true;
        isAutumn = false;
    } else if (forcedSeason === 'otoño') {
        isChristmasEventActive = false;
        isAutumn = true;
    } else {
        // Lógica automática
        isChristmasEventActive = isChristmasForTesting || (month === 11 || (month === 0 && day <= 16));
        isAutumn = (month >= 8 && month <= 10) || (month === 11 && day <= 15);
    }

    const sourceOgg = document.getElementById('musicSourceOgg');
    
    let songName = isChristmasEventActive ? 'navidad' : 'normal'; 

    // --- LIMPIAR partículas antes de crear nuevas ---
    clearParticles();

    // --- Gestión de Partículas Estacionales ---
    if (isChristmasEventActive) {
        createSnowflakes(100); 
    } else if (isAutumn) {
        createAutumnLeaves(25);
    }

    // --- Mostrar notificación de estación ---
    setTimeout(() => {
        showSeasonNotification(forcedSeason);
    }, 1000);

    // --- Gestión del Audio ---
    if (audioPlayer && sourceOgg) {
        const newSrc = `${songName}.ogg`;
        const wasPlaying = !audioPlayer.paused;
        
        const currentSrcPath = sourceOgg.src;
        const currentSongName = currentSrcPath ? currentSrcPath.split('/').pop().split('.')[0] : '';
        
        if (currentSongName !== songName) {
            sourceOgg.src = newSrc; 
            audioPlayer.volume = 0.5; 
            audioPlayer.load(); 
            
            if (wasPlaying || shouldKeepPlaying) {
                 audioPlayer.play().catch(e => {
                     console.error("Error al reproducir después del cambio de canción:", e);
                     audioPlayer.pause(); 
                     updateMusicButtonIcon();
                 });
            }
        }
    }
}


// ====================================================================
// === FUNCIONES DE MÚSICA Y DEBUG (MODIFICADO) ===
// ====================================================================

// REESTABLECIDO: Emojis originales 🔈/🔊
function updateMusicButtonIcon() {
    if (!musicToggleButton || !audioPlayer) return;
    
    musicToggleButton.textContent = audioPlayer.paused ? '🔈' : '🔊';
}

function toggleMusic() {
    if (!audioPlayer) return;

    if (audioPlayer.paused) {
        audioPlayer.play().then(() => {
            updateMusicButtonIcon();
        }).catch(e => {
            console.error("Error al reproducir. El navegador bloquea el inicio:", e);
            updateMusicButtonIcon();
        });
    } else {
        audioPlayer.pause();
        updateMusicButtonIcon();
    }
}


// MODIFICADO: Lógica del selector de fecha
function handleDebugManualDateSet() {
    const dateStr = debugManualDateInput.value;
    const timeStr = debugManualTimeInput.value;
    
    if (!dateStr || !timeStr) {
        alert("Por favor, selecciona una fecha y una hora.");
        return;
    }
    
    const fullDateStr = `${dateStr}T${timeStr}:00`; 
    const newTargetDate = new Date(fullDateStr).getTime();
    
    if (isNaN(newTargetDate)) {
        alert("La fecha u hora seleccionada no es válida.");
        return;
    }
    
    // 1. Establece el "ahora" falso
    fakeNow = newTargetDate;
    
    // 2. Actualiza el display de la fecha actual (la de arriba)
    updateCurrentDate(newTargetDate);
    
    // 3. Refresca el contador inmediatamente
    updateCountdown();
    
    // Quitar la activación de botones del selector principal 
    setActiveButton(null);
}


function initDebugPanel() {
    const debugPanel = document.createElement('div');
    debugPanel.id = 'debugPanel';
    
    const title = document.createElement('h3');
    title.textContent = '⚙️ MODO DEBUG';
    debugPanel.appendChild(title);

    // --- Selector de Fuentes (Original) ---
    const fontGroup = document.createElement('div');
    fontGroup.style.marginBottom = '10px';
    const fontLabel = document.createElement('label');
    fontLabel.textContent = 'Fuente: ';
    fontLabel.htmlFor = 'debug-font-selector';
    const fontSelector = document.createElement('select');
    fontSelector.id = 'debug-font-selector';
    let currentFontKey = loadFontPreference();
    for (const key in AVAILABLE_FONTS) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = key;
        fontSelector.appendChild(option);
        loadGoogleFont(AVAILABLE_FONTS[key].name, AVAILABLE_FONTS[key].url);
    }
    fontSelector.value = currentFontKey;
    fontSelector.addEventListener('change', (event) => {
        const selectedKey = event.target.value;
        applyFont(selectedKey);
        saveFontPreference(selectedKey);
    });
    fontGroup.appendChild(fontLabel);
    fontGroup.appendChild(fontSelector);
    debugPanel.appendChild(fontGroup);
    
    // --- Selector de Frase Personalizada (NUEVO) ---
    const customSplashGroup = document.createElement('div');
    customSplashGroup.style.marginBottom = '10px';
    customSplashGroup.style.padding = '10px';
    customSplashGroup.style.border = '1px solid #7f8d00';
    customSplashGroup.style.backgroundColor = '#111';

    const customSplashLabel = document.createElement('label');
    customSplashLabel.textContent = 'Frase Personalizada:';
    customSplashLabel.style.display = 'block';
    customSplashLabel.style.marginBottom = '5px';
    customSplashLabel.style.color = '#e5ff00';

    const customSplashInput = document.createElement('input');
    customSplashInput.type = 'text';
    customSplashInput.placeholder = 'Escribe tu frase aquí...';
    customSplashInput.style.width = '100%';
    customSplashInput.style.padding = '5px';
    customSplashInput.style.marginBottom = '5px';
    customSplashInput.style.backgroundColor = '#000';
    customSplashInput.style.color = '#fff';
    customSplashInput.style.border = '1px solid #e5ff00';

    const customSplashButton = document.createElement('button');
    customSplashButton.textContent = '🔤 Probar Frase';
    customSplashButton.style.marginBottom = '5px';

    const resetSplashButton = document.createElement('button');
    resetSplashButton.textContent = '🔄 Frase Aleatoria';

    // Función para probar frase personalizada
    customSplashButton.onclick = function() {
        const customText = customSplashInput.value.trim();
        if (customText) {
            // Aplicar la frase personalizada al splash
            const randomColorClass = SPLASH_COLORS[Math.floor(Math.random() * SPLASH_COLORS.length)];
            milestoneSplash.className = milestoneSplash.className.replace(/milestone-(red|green|blue|yellow|purple)/g, '');
            milestoneSplash.classList.add(randomColorClass);
            milestoneSplash.textContent = customText;
            milestoneSplash.classList.remove('milestone-hidden');
            
            console.log("✅ Frase personalizada aplicada:", customText);
        } else {
            alert("Por favor, escribe una frase primero.");
        }
    };

    // Función para volver a frase aleatoria
    resetSplashButton.onclick = function() {
        setInitialSplashText();
        customSplashInput.value = ''; // Limpiar el input
        console.log("✅ Volviendo a frase aleatoria");
    };

    customSplashGroup.appendChild(customSplashLabel);
    customSplashGroup.appendChild(customSplashInput);
    customSplashGroup.appendChild(customSplashButton);
    customSplashGroup.appendChild(resetSplashButton);

    debugPanel.appendChild(customSplashGroup);
    
    // --- MODIFICADO: Selector de Fecha (para 'fakeNow') ---
    const manualDateGroup = document.createElement('div');
    manualDateGroup.classList.add('date-selector-group-debug');
    
    const dateLabel = document.createElement('label');
    dateLabel.textContent = "Forzar 'Fecha Actual' (DEBUG):";
    manualDateGroup.appendChild(dateLabel);

    debugManualDateInput = document.createElement('input');
    debugManualDateInput.type = 'date';
    debugManualDateInput.id = 'debugManualDateInput';
    
    debugManualTimeInput = document.createElement('input');
    debugManualTimeInput.type = 'time';
    debugManualTimeInput.id = 'debugManualTimeInput';
    debugManualTimeInput.value = '15:00'; 
    
    debugSetManualDateBtn = document.createElement('button');
    debugSetManualDateBtn.textContent = "Establecer 'HOY'";
    debugSetManualDateBtn.onclick = handleDebugManualDateSet;
    
    manualDateGroup.appendChild(debugManualDateInput);
    manualDateGroup.appendChild(debugManualTimeInput);
    manualDateGroup.appendChild(debugSetManualDateBtn);
    
    debugPanel.appendChild(manualDateGroup);
    
    // --- Botones de Control (Modificados para desactivación automática) ---
    const btnChristmas = document.createElement('button');
    btnChristmas.textContent = forcedSeason === 'navidad' ? '🎁 Desactivar Navidad' : '🎄 Forzar Navidad';
    btnChristmas.onclick = function() {
        if (forcedSeason === 'navidad') {
            // Desactivar modo forzado
            forcedSeason = null;
            isChristmasForTesting = false;
            btnChristmas.textContent = '🎄 Forzar Navidad';
        } else {
            // Activar navidad y desactivar otoño
            forcedSeason = 'navidad';
            isChristmasForTesting = true;
            btnChristmas.textContent = '🎁 Desactivar Navidad';
        }
        
        const wasPlaying = !audioPlayer.paused;
        manageSeasonalContent(wasPlaying); 
    };
    debugPanel.appendChild(btnChristmas);
    
    // --- Botón para forzar Otoño (Modificado) ---
    const btnAutumn = document.createElement('button');
    btnAutumn.textContent = forcedSeason === 'otoño' ? '🍂 Desactivar Otoño' : '🍂 Forzar Otoño';
    btnAutumn.onclick = function() {
        if (forcedSeason === 'otoño') {
            // Desactivar modo forzado
            forcedSeason = null;
            btnAutumn.textContent = '🍂 Forzar Otoño';
        } else {
            // Activar otoño y desactivar navidad
            forcedSeason = 'otoño';
            isChristmasForTesting = false; // Desactivar navidad
            btnChristmas.textContent = '🎄 Forzar Navidad'; // Actualizar botón navidad
            btnAutumn.textContent = '🍂 Desactivar Otoño';
        }
        
        const wasPlaying = !audioPlayer.paused;
        manageSeasonalContent(wasPlaying);
    };
    debugPanel.appendChild(btnAutumn);
    
    const btnEndCountdown = document.createElement('button');
    btnEndCountdown.textContent = '🛑 Forzar Final (5s)';
    btnEndCountdown.onclick = function() {
        // Modificado: Debe respetar el 'fakeNow' si existe
        const now = fakeNow ? fakeNow : new Date().getTime();
        currentTargetDate = now + 5000;
        startCountdown();
    };
    debugPanel.appendChild(btnEndCountdown);
    
    const btnResetCountdown = document.createElement('button');
    btnResetCountdown.textContent = '🔄 Volver a Fecha Normal';
    btnResetCountdown.onclick = function() {
        // MODIFICADO: Resetea el 'fakeNow'
        fakeNow = null;
        updateCurrentDate(); // Actualiza el display de fecha
        
        currentTargetDate = TARGET_DATE_DEFAULT;
        startCountdown();
        updateSubtitle(TARGET_DATE_DEFAULT, 'default');
        setActiveButton(document.querySelector('.date-button[data-key="ccaa"]'));
        ccaaSelector.classList.add('hidden');
    };
    debugPanel.appendChild(btnResetCountdown);
    
    document.body.appendChild(debugPanel);
}


// ====================================================================
// === INICIALIZACIÓN GLOBAL ===
// ====================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Cargar referencias del DOM (¡CORRECTO! PRIMERO)
    loadDomReferences();
    
    // 2. Cargar la preferencia de fuente (Ahora 'daysSpan' SÍ existe)
    loadFontPreference(); 
    
    // 3. Configurar selectores de fecha y subtítulo
    setupDateSelectors(); 
    
    // 4. Iniciar lógica principal
    startCountdown();
    
    // 5. Actualizar fecha actual
    updateCurrentDate();
    
    // 6. Actualizar icono día/noche
    updateDayNightIcon();
    
    // 7. MODIFICADO: Iniciar el splash text (solo una vez)
    setInitialSplashText();

    // 8. Cargar contenido estacional
    manageSeasonalContent(); 
    
    // 9. Inicializar botón de música
    if (musicToggleButton) {
        musicToggleButton.addEventListener('click', toggleMusic);
        updateMusicButtonIcon(); 
    }

    // 10. Iniciar modo debug
    if (DEBUG_MODE) {
        initDebugPanel();
    }
});