// Dependencias: config.js, dom_refs.js, fx.js (para updateMusicButtonIcon)

function resetCountdownDisplay() {
    // Si la cuenta atrás ha terminado, restauramos el HTML original de los spans
    if (countdownElement.innerHTML.includes("¡ES LA HORA!")) {
        // Reconstruimos el HTML para que las referencias (días, horas, etc.) vuelvan a existir
        countdownElement.innerHTML = `
            <span class="countdown-item"><span id="days">000</span><br>DÍAS</span>
            <span class="countdown-item"><span id="hours">00</span><br>HORAS</span>
            <span class="countdown-item"><span id="minutes">00</span><br>MINUTOS</span>
            <span class="countdown-item"><span id="seconds">00</span><br>SEGUNDOS</span>
        `;
        // CORRECCIÓN CRÍTICA: Recargar SOLO las referencias de los spans del contador después de modificar el HTML
        // Si llamásemos a loadDomReferences() se intentarían recargar también las referencias
        // de los elementos eliminados o se resetearía el audio, causando errores.
        daysSpan = document.getElementById('days');
        hoursSpan = document.getElementById('hours');
        minutesSpan = document.getElementById('minutes');
        secondsSpan = document.getElementById('seconds');
    }
}

function updateCountdown() {
    const now = new Date().getTime();
    const distance = currentTargetDate - now;

    // Si la cuenta atrás ha terminado
    if (distance < 0) {
        clearInterval(countdownIntervalId);
        countdownElement.innerHTML = "¡ES LA HORA!";
        if (typeof updateMusicButtonIcon === 'function' && audioPlayer && !audioPlayer.paused) {
            audioPlayer.pause();
            updateMusicButtonIcon(); 
        }
        return; 
    }
    
    // Si no ha terminado, calcular y mostrar
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysSpan.textContent = String(days).padStart(3, '0');
    hoursSpan.textContent = String(hours).padStart(2, '0');
    minutesSpan.textContent = String(minutes).padStart(2, '0');
    secondsSpan.textContent = String(seconds).padStart(2, '0');
}

function startCountdown(interval = 1000) {
    if (countdownIntervalId) clearInterval(countdownIntervalId);
    
    resetCountdownDisplay();
    updateCountdown();
    countdownIntervalId = setInterval(updateCountdown, interval);
}