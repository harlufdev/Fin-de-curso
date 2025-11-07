// ====================================================================
// === CONTROL DE CONFIGURACIÓN Y VARIABLES GLOBALES ===
// ====================================================================

const DEBUG_MODE = false; 
let isChristmasForTesting = false; 

// Fechas para 2026
const TARGET_DATE_DEFAULT = new Date('2026-06-21T15:00:00').getTime(); 
const DATE_BACH = new Date('2026-05-20T15:00:00').getTime();           
const DATE_RECUP = new Date('2026-07-01T15:00:00').getTime();          

// Fechas por CCAA
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
    'GAL': {name: 'Galicia', date: '2026-06-19T15:00:00'},
    'RIO': {name: 'La Rioja', date: '2026-06-23T15:00:00'},
    'MUR': {name: 'Región de Murcia', date: '2026-06-24T15:00:00'},
    'NAV': {name: 'Comunidad Foral de Navarra', date: '2026-06-17T15:00:00'},
    'EUS': {name: 'País Vasco', date: '2026-06-19T15:00:00'}
};

// ====================================================================
// === SPLASH TEXTS ===
// ====================================================================
const SPLASH_TEXTS = [
    "¡Vete ya a estudiar!",
    "La libreta no se va a abrir sola.",
    "¿Seguro que has entendido el tema 3?",
    "El examen se acerca, ¡corre!",
    "El despertador no va a sonar dos veces.",
    "Deja de mirar la cuenta, no ayuda.",
    "El último esfuerzo es el que cuenta.",
    "El verano es para los valientes.",
    "¿Qué haces despierto tan tarde?",
    "Falta menos que ayer.",
    "¡Modo Hyperfocus activado!",
    "No te rindas, ya casi puedes oler la playa.",
    "Pórtate bien con el profesor de mates.",
    "¡Esto no es un juego, es el Bachillerato!",
    "Tu yo del futuro te lo agradecerá.",
    "¡El café no hace milagros!",
    "El que algo quiere, algo le cuesta.",
    "Si no lo haces tú, nadie lo hará.",
    "El tiempo corre más rápido de lo que crees.",
    "¡Alerta máxima de vagancia!",
    "¿Has mirado tu horario?",
    "Hoy es un buen día para empezar el TFG.",
    "No te olvides del proyecto final.",
    "¡Cuidado con la procrastinación!",
    "Un día más cerca de la libertad.",
    "La luz al final del túnel es real.",
    "¡Sigue programando hasta el amanecer!",
    "Tu media te necesita.",
    "Pene",
    "Esto va a terminar, te lo juro.",
    "¿Has bebido agua hoy?",
    "¿Quién estudia en pleno 2026?",
    "Un buen descanso también es estudiar.",
    "¡No te duermas en los laureles!",
    "El conocimiento es poder.",
    "Piensa en la siesta de junio... zzzzz",
    "¡El modo avión es tu amigo!",
    "¡Ya pasó lo peor!",
    "¡Eres más fuerte de lo que piensas!",
    "¡El final está cerca!",
    "La suerte favorece a la mente preparada.",
    "¡Enfócate en lo esencial!",
    "No hay atajos para el éxito.",
    "Haz que valga la pena.",
    "¡Elige un tema y domínalo!",
    "La vida post-instituto espera.",
    "¡Este es tu momento!",
    "¡No te distraigas con Twitter!",
    "Desinstala Discord, es por tu bien.",
    "Un café y a seguir.",
    "¿A qué huelen las vacaciones?",
    "¡El último tirón!",
    "¡El poder de la concentración!",
    "Si fuera fácil, todos lo harían.",
    "La recompensa será épica.",
    "¡Activa el modo bestia!",
    "No permitas que la fecha te asuste.",
    "La clave es la constancia",
    "¡Visualiza tu aprobado!",
    "Estudia duro, no inteligente, no espera así no era",
    "¡La alarma es tu amiga!",
    "Que llegue a 0 esto, no?",
    "La excelencia es un hábito.",
    "Un paso más, ¡venga!",
    "Ignora las frases motivadoras",
    "¡Que no decaiga el ánimo!",
    "No dejes para mañana...",
    "¡Tu futuro te llama!",
    "El camino es largo, pero merece la pena.",
    "¡Paciencia y buena letra!",
    "¡A por el sobresaliente!",
    "La disciplina vence al talento.",
    "¡Recuerda tus metas!",
    "El fracaso es temporal, rendirse es permanente.",
    "¡Ponle pasión a lo que haces!",
    "@another_harluf en ig",
    "Wabiwabo.",
    "Cada minuto cuenta.",
    "¡La gloria te espera!",
    "¡Que empiece la cuenta atrás!",
    "¡Tu esfuerzo es tu mejor arma!",
    "Sé la envidia de tus compañeros.",
    "¡El cielo es el límite!",
    "Estoy cansado de escribir frases",
    "Tienes un parte",
    "¡No te lo pienses más!",
    ":P",
    ":D",
    "¡Haz un descanso de 5 minutos!",
    "El descanso ya lleva más de 5 minutos",
    "Ya, pone a estudiar",
    "Luego te quejas de que suspendes",
    "¡El examen no es un monstruo!",
    "¡Que la fuerza te acompañe!",
    "¡Vamos a darle caña!",
    "¡A por todas!",
    "El futuro es brillante.",
    "¡El mejor momento es ahora!",
    "Esta es la última frase del código.",
];

// ====================================================================
// === CONFIGURACIÓN DE PERSONALIZACIÓN (FUENTES) ===
// ====================================================================

const AVAILABLE_FONTS = {
    'Arial (Default)': { 
        name: 'Arial', 
        url: '', 
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
        url: '', 
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

// NUEVO: Variable para forzar el "ahora" en modo debug
let fakeNow = null;