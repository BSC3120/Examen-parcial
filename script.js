// --- ELEMENTOS DEL SLIDER ---
const track = document.getElementById('sliderTrack');
const dots = document.querySelectorAll('.dot');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');

// --- ELEMENTOS DEL VIDEO MODAL ---
const videoTrigger = document.getElementById('videoTrigger'); // Asegúrate que el ID coincida en tu HTML
const videoModal = document.getElementById('videoModal');
const videoIframe = document.getElementById('videoIframe');
const closeBtn = document.querySelector('.video-modal-close');

let currentIndex = 0;
let isMoving = false;

// --- LÓGICA DEL SLIDER ---

function updateDots(index) {
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function move(direction) {
    if (isMoving) return;
    isMoving = true;

    currentIndex = (direction === 'next') ? (currentIndex + 1) % 2 : (currentIndex - 1 + 2) % 2;
    updateDots(currentIndex);

    if (direction === 'next') {
        track.style.transition = "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
        track.style.transform = `translateX(-50%)`;

        setTimeout(() => {
            track.style.transition = "none";
            track.appendChild(track.firstElementChild);
            track.style.transform = `translateX(0)`;
            isMoving = false;
        }, 600);
    } else {
        // CORRECCIÓN PROFESIONAL: Eliminamos track.offsetHeight
        track.style.transition = "none";
        track.prepend(track.lastElementChild);
        
        // Usamos requestAnimationFrame para sincronizar con el refresco de pantalla
        requestAnimationFrame(() => {
            track.style.transform = `translateX(-50%)`;
            requestAnimationFrame(() => {
                track.style.transition = "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
                track.style.transform = `translateX(0)`;
            });
        });
        
        setTimeout(() => {
            isMoving = false;
        }, 600);
    }
}

// --- LÓGICA DEL VIDEO (MODAL) ---

// URL de YouTube (formato /embed/ para que funcione en el modal)
const youtubeURL = "https://www.youtube.com/embed/FGns89Rpwos?autoplay=1";

videoTrigger.addEventListener('click', () => {
    videoIframe.src = youtubeURL;
    videoModal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Bloquea el scroll de la página
});

function cerrarModal() {
    videoModal.style.display = 'none';
    videoIframe.src = ""; // Detiene el video para ahorrar recursos
    document.body.style.overflow = 'auto'; // Restaura el scroll
}

closeBtn.addEventListener('click', cerrarModal);

// Cerrar si el usuario hace clic fuera del cuadro de video
videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) cerrarModal();
});

// --- EVENTOS Y TIMERS ---
let timer = setInterval(() => move('next'), 10000);

const resetTimer = () => { 
    clearInterval(timer); 
    timer = setInterval(() => move('next'), 10000); 
};

nextBtn.addEventListener('click', () => { move('next'); resetTimer(); });
prevBtn.addEventListener('click', () => { move('prev'); resetTimer(); });