// ====================================================================
// === REFERENCIAS DEL DOM (Para ser accesibles globalmente) ===
// ====================================================================

let daysSpan, hoursSpan, minutesSpan, secondsSpan;
let audioPlayer, countdownElement, musicToggleButton, dateSelectorsContainer, ccaaSelector;

function loadDomReferences() {
    daysSpan = document.getElementById('days');
    hoursSpan = document.getElementById('hours');
    minutesSpan = document.getElementById('minutes');
    secondsSpan = document.getElementById('seconds');
    audioPlayer = document.getElementById('backgroundMusic');
    countdownElement = document.getElementById('countdown');
    musicToggleButton = document.getElementById('musicToggle');
    dateSelectorsContainer = document.getElementById('dateSelectors');
    ccaaSelector = document.getElementById('ccaaSelector'); 
}