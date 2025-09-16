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
        daysSpan.textContent = String(days).padStart(2, '0');
        hoursSpan.textContent = String(hours).padStart(2, '0');
        minutesSpan.textContent = String(minutes).padStart(2, '0');
        secondsSpan.textContent = String(seconds).padStart(2, '0');

        // Si la cuenta atrás ha terminado
        if (distance < 0) {
            clearInterval(countdownInterval);
            document.getElementById('countdown').innerHTML = "¡ES LA HORA!";
            document.getElementById('bottomImage').style.display = 'none'; // Oculta la imagen inferior cuando termina
        }
    }

    // Actualizar el contador cada segundo
    const countdownInterval = setInterval(updateCountdown, 1000);

    // Llamar a updateCountdown una vez al cargar para evitar el "flash" de 00
    updateCountdown();

});
