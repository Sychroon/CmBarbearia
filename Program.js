
function abrirModal() {
    document.querySelector(".Ag-card").style.display = "flex";
}

function fecharModal() {
    document.querySelector(".Ag-card").style.display = "none";
}
// Carrossel
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');
const track = document.querySelector('.carousel-track');

function showSlide(index) {
    if (slides.length === 0) return;

    if (index >= slides.length) currentSlide = 0;
    if (index < 0) currentSlide = slides.length - 1;

    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    dots.forEach(dot => dot.classList.remove('active'));
    dots[currentSlide].classList.add('active');
}

function nextSlide() {
    currentSlide++;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide--;
    showSlide(currentSlide);
}

// Event listeners para os botões
document.querySelector('.carousel-btn-next').addEventListener('click', nextSlide);
document.querySelector('.carousel-btn-prev').addEventListener('click', prevSlide);

// Event listeners para os pontos
dots.forEach(dot => {
    dot.addEventListener('click', () => {
        currentSlide = parseInt(dot.dataset.index);
        showSlide(currentSlide);
    });
});

// Auto-play do carrossel (opcional - a cada 5 segundos)
setInterval(nextSlide, 5000);