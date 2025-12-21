const track = document.getElementById('sliderTrack');
const dots = document.querySelectorAll('.dot');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');

let currentIndex = 0;
let isMoving = false;

function updateDots(index) {
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function move(direction) {
    if (isMoving) return;
    isMoving = true;

    // El color cambia inmediatamente (Velocidad visual)
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
        // Para ir hacia atrás, primero movemos el elemento y el track sin animación
        track.style.transition = "none";
        track.prepend(track.lastElementChild);
        track.style.transform = `translateX(-50%)`;
        
        // Forzar renderizado
        track.offsetHeight; 

        track.style.transition = "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
        track.style.transform = `translateX(0)`;
        
        setTimeout(() => {
            isMoving = false;
        }, 600);
    }
}

// Timer 10s
let timer = setInterval(() => move('next'), 10000);
const resetTimer = () => { clearInterval(timer); timer = setInterval(() => move('next'), 10000); };

nextBtn.addEventListener('click', () => { move('next'); resetTimer(); });
prevBtn.addEventListener('click', () => { move('prev'); resetTimer(); });