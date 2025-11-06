// Dependencias: config.js, dom_refs.js, countdown.js

// ====================================================================
// === GESTIÓN DE PERSONALIZACIÓN (FUENTES) ===
// ====================================================================

function loadGoogleFont(fontName, fontUrl) {
    if (!fontUrl) return; 
    
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
    
    // Aplicar la fuente al body (establece la fuente para toda la página)
    document.body.style.fontFamily = `'${fontData.name}', ${fontData.fallback}`;
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
// === GENERADOR DE PARTÍCULAS DE NIEVE (Mantenido) ===
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
// === GESTIÓN DE CONTENIDO ESTACIONAL (NAVIDAD Y MÚSICA) ===
// ====================================================================

function manageSeasonalContent(shouldKeepPlaying = false) {
    const today = new Date();
    const month = today.getMonth(); 
    const day = today.getDate();
    
    const isChristmasEventActive = isChristmasForTesting || (month === 11 || (month === 0 && day <= 16));

    const sourceOgg = document.getElementById('musicSourceOgg');
    const particlesContainer = document.getElementById('particles-js');
    
    let songName = isChristmasEventActive ? 'navidad' : 'normal'; 

    // --- Gestión de la Nieve ---
    if (isChristmasEventActive) {
        createSnowflakes(100); 
    } else {
        if(particlesContainer) particlesContainer.innerHTML = ''; 
    }

    // --- Gestión del Audio ---
    if (audioPlayer && sourceOgg) {
        const newSrc = `audio/${songName}.ogg`;
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
// === FUNCIONES DE MÚSICA Y DEBUG (INCLUYE SELECTOR DE FUENTES) ===
// ====================================================================

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


function initDebugPanel() {
    const debugPanel = document.createElement('div');
    debugPanel.id = 'debugPanel';
    
    // Título
    const title = document.createElement('h3');
    title.textContent = '⚙️ MODO DEBUG';
    debugPanel.appendChild(title);

    // --- Selector de Fuentes ---
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
    
    // --- Botones de Control ---
    
    const btnChristmas = document.createElement('button');
    btnChristmas.textContent = isChristmasForTesting ? '🎁 Desactivar Navidad' : '🎄 Forzar Navidad';
    btnChristmas.onclick = function() {
        isChristmasForTesting = !isChristmasForTesting;
        const wasPlaying = !audioPlayer.paused;
        manageSeasonalContent(wasPlaying); 
        btnChristmas.textContent = isChristmasForTesting ? '🎁 Desactivar Navidad' : '🎄 Forzar Navidad';
    };
    debugPanel.appendChild(btnChristmas);
    
    const btnEndCountdown = document.createElement('button');
    btnEndCountdown.textContent = '🛑 Forzar Final (5s)';
    btnEndCountdown.onclick = function() {
        currentTargetDate = new Date().getTime() + 5000;
        startCountdown();
    };
    debugPanel.appendChild(btnEndCountdown);
    
    const btnResetCountdown = document.createElement('button');
    btnResetCountdown.textContent = '🔄 Volver a Fecha Normal';
    btnResetCountdown.onclick = function() {
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
    // 1. Cargar la preferencia de fuente antes de cargar referencias
    loadFontPreference(); 
    
    // 2. Cargar referencias del DOM
    loadDomReferences();
    
    // 3. Configurar selectores de fecha y subtítulo
    setupDateSelectors(); 
    
    // 4. Iniciar lógica principal
    startCountdown();
    manageSeasonalContent(); 
    
    // 5. Inicializar botón de música
    if (musicToggleButton) {
        musicToggleButton.addEventListener('click', toggleMusic);
        updateMusicButtonIcon(); 
    }

    // 6. Iniciar modo debug
    if (DEBUG_MODE) {
        initDebugPanel();
    }
});