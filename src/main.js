const header = document.querySelector('[data-header]');
const scene = document.querySelector('[data-phone-scene]');
const colorPhone = document.querySelector('[data-color-phone]');
const colorName = document.querySelector('[data-color-name]');
const swatches = document.querySelectorAll('.swatch');
const revealItems = document.querySelectorAll('.reveal');

function updateHeader() {
  header?.classList.toggle('scrolled', window.scrollY > 24);
}

function updateScene(event) {
  if (!scene || window.matchMedia('(max-width: 880px)').matches) {
    return;
  }

  const rect = scene.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;

  scene.style.transform = `rotateX(${y * -7}deg) rotateY(${x * 10}deg)`;
}

function resetScene() {
  if (scene) {
    scene.style.transform = '';
  }
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item) => revealObserver.observe(item));

swatches.forEach((button) => {
  button.addEventListener('click', () => {
    swatches.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');

    const color = button.dataset.color || '#d8dde8';
    const name = button.dataset.name || '月影银';
    colorPhone?.style.setProperty('--active-color', color);
    if (colorName) {
      colorName.textContent = name;
    }
  });
});

window.addEventListener('scroll', updateHeader, { passive: true });
scene?.addEventListener('pointermove', updateScene);
scene?.addEventListener('pointerleave', resetScene);
updateHeader();
