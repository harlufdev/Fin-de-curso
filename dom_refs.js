// ====================================================================
// === REFERENCIAS DEL DOM (Para ser accesibles globalmente) ===
// ====================================================================

let daysSpan, hoursSpan, minutesSpan, secondsSpan;
let audioPlayer, countdownElement, musicToggleButton, dateSelectorsContainer, ccaaSelector;
// NUEVAS REFERENCIAS:
let currentDateDisplay, dayNightIcon, milestoneSplash;
// Referencias para el selector manual DENTRO del debug panel
let debugManualDateInput, debugManualTimeInput, debugSetManualDateBtn;

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
    
    // NUEVOS ELEMENTOS:
    currentDateDisplay = document.getElementById('currentDate');
    dayNightIcon = document.getElementById('dayNightIcon');
    milestoneSplash = document.getElementById('milestoneSplash');
}