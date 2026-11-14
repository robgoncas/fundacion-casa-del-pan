const testimonials = [
  {
    src: 'assets/images/testimonios/testimonio-01.jpeg',
    alt: 'Participantes de un taller de arte y expresión',
    title: 'Encuentro creativo',
    tag: 'Taller comunitario',
    quote: '“Cada sesión nos devolvía la confianza en nuestro propio gesto, en nuestra forma de mirar y de crear.”'
  },
  {
    src: 'assets/images/testimonios/testimonio-02.jpeg',
    alt: 'Trabajos manuales con materiales reciclados',
    title: 'Manos que transforman',
    tag: 'Reciclaje y arte',
    quote: '“Lo simple se volvió una materia preciosa. Aprendimos a ver valor donde antes solo veíamos residuos.”'
  },
  {
    src: 'assets/images/testimonios/testimonio-03.jpeg',
    alt: 'Personas compartiendo durante una actividad artística',
    title: 'Espacio de pertenencia',
    tag: 'Comunicación',
    quote: '“El taller nos abrió un lugar de escucha: hablar, crear y compartir nos hizo sentir parte de algo más grande.”'
  },
  {
    src: 'assets/images/testimonios/testimonio-04.jpeg',
    alt: 'Muestra de piezas hechas por participantes',
    title: 'Memoria hecha arte',
    tag: 'Arte y memoria',
    quote: '“Cada trabajo llevaba una historia. Lo que salía de nuestras manos también volvía a nosotros con cariño.”'
  },
  {
    src: 'assets/images/testimonios/testimonio-05.jpeg',
    alt: 'Grupo de participantes observando sus trabajos',
    title: 'Miradas compartidas',
    tag: 'Taller grupal',
    quote: '“La mejor parte fue ver cómo cada persona encontraba su propio estilo y se animaba a mostrarse.”'
  },
  {
    src: 'assets/images/testimonios/testimonio-06.jpeg',
    alt: 'Niños y adultos creando en un taller de arte',
    title: 'Arte que acompaña',
    tag: 'Inclusión',
    quote: '“Aquí no se pedía perfección: se pedía ser, escuchar y crear con el corazón.”'
  },
  {
    src: 'assets/images/testimonios/testimonio-07.jpeg',
    alt: 'Producciones del taller con colores y texturas',
    title: 'Color en comunidad',
    tag: 'Taller de color',
    quote: '“El color nos ayudó a nombrar emociones. Fue una forma de decir lo que a veces cuesta decir en palabras.”'
  },
  {
    src: 'assets/images/testimonios/testimonio-08.jpeg',
    alt: 'Momentos de reunión y creatividad',
    title: 'Taller de alegría',
    tag: 'Grupo',
    quote: '“Vimos reírnos, equivocarnos y volver a empezar. Ese proceso nos hizo crecer y sentirnos más libres.”'
  },
  {
    src: 'assets/images/testimonios/testimonio-09.jpeg',
    alt: 'Participantes frente a obras realizadas en un taller',
    title: 'Cierre con orgullo',
    tag: 'Exposición',
    quote: '“Cuando vimos nuestras obras juntas, entendimos que cada pieza tenía su voz. Había orgullo, ternura y mucha fuerza.”'
  },
  {
    src: 'assets/images/testimonios/testimonio-10.jpeg',
    alt: 'Cierre de taller con trabajos en el suelo',
    title: 'Arte para crecer',
    tag: 'Aprendizaje',
    quote: '“Aprendimos a compartir espacio, materiales y sueños. Eso hizo que cada trabajo fuese más rico.”'
  },
  {
    src: 'assets/images/testimonios/testimonio-11.jpeg',
    alt: 'Personas creando en una actividad colectiva',
    title: 'Relatos en movimiento',
    tag: 'Colectivo',
    quote: '“La experiencia de crear juntos nos ayudó a transformar la rutina en un momento de presencia real.”'
  },
  {
    src: 'assets/images/testimonios/testimonio-12.jpeg',
    alt: 'Taller de arte con materiales cotidianos',
    title: 'La creatividad como hogar',
    tag: 'Comunidad',
    quote: '“De pronto, el taller se volvió un lugar donde cabíamos todos: nuestras historias, nuestras dudas y nuestras ganas de crear.”'
  }
];

const grid = document.getElementById('testimonials-grid');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.querySelector('[data-lightbox-image]');
const lightboxTitle = document.querySelector('[data-lightbox-title]');
const lightboxTag = document.querySelector('[data-lightbox-tag]');
const lightboxQuote = document.querySelector('[data-lightbox-quote]');
const closeButton = document.querySelector('[data-lightbox-close]');
const prevButton = document.querySelector('[data-lightbox-prev]');
const nextButton = document.querySelector('[data-lightbox-next]');

let currentIndex = 0;

function setupMobileMenu() {
  const toggleButtons = document.querySelectorAll('[data-mobile-menu-toggle]');
  const closeButtons = document.querySelectorAll('[data-mobile-menu-close]');
  const drawers = document.querySelectorAll('.mobile-nav-drawer');
  const backdrops = document.querySelectorAll('.mobile-nav-backdrop');

  const closeMenus = () => {
    drawers.forEach((drawer) => {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
    });
    backdrops.forEach((backdrop) => { backdrop.hidden = true; });
    toggleButtons.forEach((button) => button.setAttribute('aria-expanded', 'false'));
  };

  const openMenu = (drawer) => {
    drawers.forEach((item) => {
      if (item !== drawer) item.classList.remove('is-open');
    });
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    const matchedBackdrop = document.getElementById(drawer.id + '-backdrop');
    if (matchedBackdrop) matchedBackdrop.hidden = false;
    toggleButtons.forEach((button) => {
      const targetId = button.getAttribute('aria-controls');
      button.setAttribute('aria-expanded', targetId === drawer.id ? 'true' : 'false');
    });
  };

  toggleButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('aria-controls');
      const drawer = document.getElementById(targetId);
      if (!drawer) return;
      if (drawer.classList.contains('is-open')) closeMenus();
      else openMenu(drawer);
    });
  });

  closeButtons.forEach((button) => button.addEventListener('click', closeMenus));
  backdrops.forEach((backdrop) => backdrop.addEventListener('click', closeMenus));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenus();
  });
}

function renderGallery() {
  testimonials.forEach((item, index) => {
    const article = document.createElement('article');
    article.className = 'testimony-card';
    article.innerHTML = `
      <button type="button" class="testimony-visual" aria-label="Ver testimonio ${String(index + 1).padStart(2, '0')}" data-index="${index}">
        <img src="${item.src}" alt="${item.alt}" style="object-position: ${item.position || '50% 32%'};">
        <span class="testimony-number">Testimonio ${String(index + 1).padStart(2, '0')}</span>
      </button>
    `;

    const button = article.querySelector('.testimony-visual');
    const image = article.querySelector('img');
    image.style.objectPosition = item.position || '50% 32%';
    button.addEventListener('click', () => openLightbox(index));
    grid.appendChild(article);
  });
}

function openLightbox(index) {
  currentIndex = index;
  const item = testimonials[index];
  if (!item) return;
  lightboxImage.src = item.src;
  lightboxImage.alt = item.alt;
  lightboxTitle.textContent = item.title;
  lightboxTag.textContent = item.tag;
  lightboxQuote.textContent = item.quote;
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = '';
}

function move(delta) {
  currentIndex = (currentIndex + delta + testimonials.length) % testimonials.length;
  openLightbox(currentIndex);
}

closeButton.addEventListener('click', closeLightbox);
prevButton.addEventListener('click', () => move(-1));
nextButton.addEventListener('click', () => move(1));
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (event) => {
  if (lightbox.hidden) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowLeft') move(-1);
  if (event.key === 'ArrowRight') move(1);
});

setupMobileMenu();
renderGallery();
