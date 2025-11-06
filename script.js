document.addEventListener('DOMContentLoaded', () => {
    // Fecha y hora objetivo (6 de agosto de 2025 a las 17:00)
    const targetDate = new Date('2026-06-19T15:00:00').getTime();

    const daysSpan = document.getElementById('days');
    const hoursSpan = document.getElementById('hours');
    const minutesSpan = document.getElementById('minutes');
    const secondsSpan = document.getElementById('seconds');

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        // Cálculo del tiempo
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Mostrar los resultados en los elementos HTML
        daysSpan.textContent = String(days).padStart(3, '0'); // Cambio a padStart(3, '0') para los días
        hoursSpan.textContent = String(hours).padStart(2, '0');
        minutesSpan.textContent = String(minutes).padStart(2, '0');
        secondsSpan.textContent = String(seconds).padStart(2, '0');

        // Si la cuenta atrás ha terminado
        if (distance < 0) {
            clearInterval(countdownInterval);
            document.getElementById('countdown').innerHTML = "¡ES LA HORA!";
            // El elemento bottomImage ya no existe en el HTML que me has pasado, por lo que esta línea es redundante, pero la dejo comentada:
            // document.getElementById('bottomImage').style.display = 'none'; 
        }
    }

    // Actualizar el contador cada segundo
    const countdownInterval = setInterval(updateCountdown, 1000);

    // Llamar a updateCountdown una vez al cargar para evitar el "flash" de 00
    updateCountdown();

});

// --- GENERADOR DE PARTÍCULAS DE NIEVE ---

function createSnowflakes(num) {
    const container = document.getElementById('particles-js');
    if (!container) return; // Asegura que el contenedor exista

    // Usamos el tamaño del viewport para posicionar la nieve
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

    for (let i = 0; i < num; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        
        // Posición inicial aleatoria (horizontalmente)
        const startPosition = Math.random() * vw;
        snowflake.style.left = startPosition + 'px';

        // Duración de la animación (velocidad de caída) aleatoria
        const duration = Math.random() * 10 + 5; // Entre 5 y 15 segundos
        snowflake.style.animationDuration = duration + 's';

        // Retraso de la animación (para que no caigan todos a la vez)
        const delay = Math.random() * -10; // Retraso negativo para que empiecen a caer inmediatamente o antes
        snowflake.style.animationDelay = delay + 's';
        
        // Tamaño y opacidad aleatorios para dar profundidad
        const size = Math.random() * 5 + 3; // Entre 3px y 8px
        snowflake.style.width = size + 'px';
        snowflake.style.height = size + 'px';
        
        container.appendChild(snowflake);
    }
}

// Llama a la función para crear 100 partículas cuando la ventana termine de cargar
window.onload = function() {
    createSnowflakes(100); 
}
