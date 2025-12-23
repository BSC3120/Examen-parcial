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
        
        track.style.transition = "none";
        track.prepend(track.lastElementChild);
        
        
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

// --- LÓGICA DEL VIDEO (MODAL) CON VALIDACIÓN DE SEGURIDAD ---

// 1. Definimos la URL ---
const youtubeURL = "https://www.youtube.com/embed/FGns89Rpwos?autoplay=1";

// 2. PROTECCIÓN: Validamos que el elemento exista antes de asignar eventos ---
if (videoTrigger) {
    videoTrigger.addEventListener('click', () => {
        if (videoIframe && videoModal) {
            videoIframe.src = youtubeURL;
            videoModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';         
            
            videoModal.style.opacity = "0";
            requestAnimationFrame(() => {
                videoModal.style.transition = "opacity 0.3s ease";
                videoModal.style.opacity = "1";
            });
        }
    });
}

// 3. Función de cierre ---
function cerrarModal() {
    if (videoModal && videoIframe) {
        videoModal.style.display = 'none';
        videoIframe.src = ""; 
        document.body.style.overflow = 'auto';
    }
}

// 4. Asignación de cierre con Optional Chaining ---
closeBtn?.addEventListener('click', cerrarModal);

// Cerrar si el uaurio toca escape ---
document.addEventListener('keydown', (e) => {
    if (e.key === "Escape" && videoModal.style.display === 'flex') {
        cerrarModal();
    }
});

// Cerrar si el usuario hace clic fuera del cuadro de video ---
videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) cerrarModal();
});

// EVENTOS Y TIMERS ---
let timer = setInterval(() => move('next'), 10000);

const resetTimer = () => { 
    clearInterval(timer); 
    timer = setInterval(() => move('next'), 10000); 
};

nextBtn.addEventListener('click', () => { move('next'); resetTimer(); });
prevBtn.addEventListener('click', () => { move('prev'); resetTimer(); });