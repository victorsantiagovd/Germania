// ============ Redirección al login ============
const accessForm = document.getElementById('accessForm');
if (accessForm) {
  accessForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const institution = document.getElementById('institution').value.trim();
    if (institution) {
      window.location.href = 'login.html?institucion=' + encodeURIComponent(institution);
    } else {
      window.location.href = 'login.html';
    }
  });
}

// ============ Carrusel de tarjetas promocionales ============
const promoCards = document.querySelectorAll('.promo-card');
const promoDots = document.querySelectorAll('.promo-dot');
let currentPromo = 0;
let promoTimer;

function showPromo(index) {
  promoCards.forEach((card, i) => card.classList.toggle('promo-card--active', i === index));
  promoDots.forEach((dot, i) => dot.classList.toggle('promo-dot--active', i === index));
  currentPromo = index;
}

function nextPromo() {
  showPromo((currentPromo + 1) % promoCards.length);
}

function startPromoTimer() {
  promoTimer = setInterval(nextPromo, 5000);
}

if (promoCards.length) {
  startPromoTimer();
  promoDots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      clearInterval(promoTimer);
      showPromo(i);
      startPromoTimer();
    });
  });
}

// ============ Menú móvil ============
const navToggle = document.getElementById('navToggle');
const navMenu = document.querySelector('.navmenu');
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('is-open');
  });
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navMenu.classList.remove('is-open'));
  });
}
