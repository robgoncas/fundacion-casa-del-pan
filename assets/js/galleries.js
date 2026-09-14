(() => {
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
      backdrops.forEach((backdrop) => {
        backdrop.hidden = true;
      });
      toggleButtons.forEach((button) => {
        button.setAttribute('aria-expanded', 'false');
      });
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
        if (drawer.classList.contains('is-open')) {
          closeMenus();
        } else {
          openMenu(drawer);
        }
      });
    });

    closeButtons.forEach((button) => button.addEventListener('click', closeMenus));
    backdrops.forEach((backdrop) => backdrop.addEventListener('click', closeMenus));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenus();
    });
  }

  setupMobileMenu();

  const auctionWorks = [
    'assets/images/obras_subasta/obra1.jpeg',
    'assets/images/obras_subasta/obra2.jpeg',
    'assets/images/obras_subasta/obra3.jpeg',
    'assets/images/obras_subasta/obra4.jpeg',
    'assets/images/obras_subasta/obra5.jpeg',
    'assets/images/obras_subasta/obra6.jpeg',
    'assets/images/obras_subasta/obra7.jpeg',
    'assets/images/obras_subasta/obra8.jpeg',
    'assets/images/obras_subasta/obra9.jpeg',
    'assets/images/obras_subasta/obra10.jpeg',
    'assets/images/obras_subasta/obra11.jpeg'
  ];

  const collectionSeries = {
    'SERIE CON_TACTO': [
      '47. La Caja de Pandora.JPG', '48. Homenaje a Luis Braille.jpg', '49. Estrella de Amar.jpg',
      '50. Para tus yemas.jpg', '51. Pecado y perdón.jpg', '52. Incógnita.jpg', '53. Esferas en un espacio virtual.jpg'
    ],
    'SERIE DESDE LA CRUZ': [
      '37. Deriva 1.jpg', '39. Desolación.jpg', '40. Descubre la luz.jpg', '41. Descansa en Él.jpg',
      '42. Poder y Sabiduría.JPG', '43. Me echaste a lo profundo en medio de los mares, y me rodeó la corriente..jpg',
      '44. Dónde estás.jpg', '45. Descubre tu centro.jpg', '46. Dios y Señor.jpg'
    ],
    'SERIE DON QUIJOTE EN VALPARAISO': [
      '25. Valparanoia.jpg', '26. Extraña aventura.jpg', '27. El Caballero y su Dama.jpg', '28. El bálsamo.jpg',
      '29. Gente cautiva.jpg', '30. Vistoso alcázar.jpg', '31. El lugar, ¡oh cielos!, que disputo y escojo.jpg',
      '32. Gratitud.jpg', '33. Transformados en la verdad de lo que fingían.jpg', '34. Los encantados.jpg',
      '35. La batalla (tríptico) 0.jpg', '36. Caja Negra (aspas).JPG'
    ],
    'SERIE ESPACIOS VIRTUALES': [
      '2. El río de la sangre.jpg', '3. El fantasma.jpeg', '5. Los Visitantes.jpg', '7. Antiguos Escritos.jpg',
      '8. Magos.jpg', '9. Vibraciones humanas.jpeg', '10. Redes secándose.jpg', '11. Viaje astral.jpeg',
      '12. Encuentro.jpg', '13. Las persistentes lágrimas de Dios.jpg',
      '14. Como se ven las montañas desde el mundo de los cubos.jpg', '15. Elenadamus.jpg',
      '16. Rostros Emergentes.jpg', '17. Batallón.jpg', '18. Espacios Virtuales.JPG'
    ],
    'SERIE MADERO': [
      '54. 2014 LECCIÓN DE PINTURA.jpg', '55. 2015 CULTURAS ANCESTRALES.jpg',
      '56. 2016 EX UMBRA IN SOLEM (Desde las sombras a la luz).jpg', '57. 2017 EL AJEDRECISTA.jpg',
      '58. 2019 DENTRO Y FUERA DE SU MARCO.jpg', '59. 2020 TARDE O TEMPRANO.jpg'
    ],
    'SERIE VIAJE ASTRAL': ['20. Alma.jpg', '21. Sueños.jpg', '22. Egos.jpg', '23. Ser.jpg', '24. Energía.jpg']
  };

  const galleryRoot = document.querySelector('[data-gallery-root]');
  const lightbox = document.querySelector('#lightbox');
  if (!galleryRoot || !lightbox) return;

  const lightboxImage = lightbox.querySelector('[data-lightbox-image]');
  const lightboxTitle = lightbox.querySelector('[data-lightbox-title]');
  const lightboxDescription = lightbox.querySelector('[data-lightbox-description]');
  const lightboxSize = lightbox.querySelector('[data-lightbox-size]');
  let currentWorks = [];
  let currentIndex = 0;

  const formatSeriesLabel = (value) => {
    const cleanValue = String(value)
      .replace(/^SERIE\s+/i, '')
      .replaceAll('_', ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const words = cleanValue.split(' ');
    const lowercaseWords = new Set(['de', 'del', 'y', 'en', 'la', 'el', 'los', 'las', 'un', 'una', 'a', 'al', 'o', 'por']);

    return words
      .map((word, index) => {
        if (!word) return word;
        const normalized = word.toLowerCase();
        if (index === 0 || !lowercaseWords.has(normalized)) {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
        return normalized;
      })
      .join(' ');
  };

  const titleFromPath = (path) => decodeURIComponent(path.split('/').pop()).replace(/\.[^.]+$/, '').replace(/^\d+\.\s*/, '');
  const artworkDetails = {
    obra7: {
      title: 'La liebre de Durero',
      author: 'Gloria Rivera',
      technique: 'Dibujo tinta china sepia',
      size: '29,5 × 24 cm'
    }
  };
  const detailsFor = (path) => artworkDetails[titleFromPath(path)] || null;
  const seriesFromPath = (path) => path.includes('obras_subasta') ? 'Obras para la subasta' : formatSeriesLabel(path.split('/')[3].replaceAll('_', ' '));
  const descriptionFor = (path) => path.includes('obras_subasta')
    ? 'Obra donada para la Primera Subasta Solidaria de Arte de la Fundación Casa del Pan.'
    : `Obra de la serie ${seriesFromPath(path)} de la colección de la Fundación Casa del Pan.`;
  const imagePath = (folder, file) => `assets/images/COLECCION FCP/${folder}/${file}`;
  const allWorks = galleryRoot.dataset.galleryRoot === 'auction'
    ? auctionWorks.map((path) => ({ path, series: 'Obras para la subasta' }))
    : Object.entries(collectionSeries).flatMap(([series, files]) => files.map((file) => ({ path: imagePath(series, file), series })));

  function card(work, index) {
    const details = detailsFor(work.path);
    const title = details?.title || titleFromPath(work.path);
    const description = details
      ? `${details.author} · ${details.technique} · ${details.size}`
      : descriptionFor(work.path);
    const figure = document.createElement('figure');
    figure.className = 'art-card';
    figure.innerHTML = `<button type="button" aria-label="Ver ${title} en pantalla completa"><img loading="lazy" src="${work.path}" alt="${title}" data-index="${index}"><figcaption><span class="art-title">${title}</span><span class="art-meta"><span>${formatSeriesLabel(work.series)}</span><span data-dimensions>Calculando tamaño...</span></span><p class="art-description">${description}</p></figcaption></button>`;
    const image = figure.querySelector('img');
    image.addEventListener('load', () => {
      figure.querySelector('[data-dimensions]').textContent = `${image.naturalWidth} × ${image.naturalHeight} px`;
    });
    figure.querySelector('button').addEventListener('click', () => openLightbox(index));
    return figure;
  }

  function render() {
    if (galleryRoot.dataset.galleryRoot === 'auction') {
      const grid = document.querySelector('[data-gallery-grid]');
      allWorks.forEach((work, index) => grid.append(card(work, index)));
      return;
    }
    const seriesContainer = document.querySelector('[data-series-container]');
    Object.entries(collectionSeries).forEach(([series, files]) => {
      const section = document.createElement('section');
      section.className = 'series-section';
      section.innerHTML = `<div class="series-heading"><div><span class="gallery-kicker">Serie</span><h2>${formatSeriesLabel(series)}</h2></div><p>${files.length} obras</p></div><div class="gallery-grid"></div>`;
      const grid = section.querySelector('.gallery-grid');
      files.forEach((file, index) => grid.append(card({ path: imagePath(series, file), series }, allWorks.findIndex((work) => work.path === imagePath(series, file)))));
      seriesContainer.append(section);
    });
  }

  function updateLightbox() {
    const work = currentWorks[currentIndex];
    const details = detailsFor(work.path);
    const title = details?.title || titleFromPath(work.path);
    lightboxImage.src = work.path;
    lightboxImage.alt = title;
    lightboxTitle.textContent = title;
    lightboxDescription.textContent = details
      ? `${details.author} · ${details.technique}`
      : descriptionFor(work.path);
    lightboxSize.textContent = details?.size || 'Cargando dimensiones...';
    lightboxImage.onload = () => {
      if (!details) lightboxSize.textContent = `${lightboxImage.naturalWidth} × ${lightboxImage.naturalHeight} px`;
    };
  }

  function openLightbox(index) {
    currentWorks = allWorks;
    currentIndex = index;
    updateLightbox();
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lightbox.querySelector('[data-lightbox-close]').focus();
  }

  function closeLightbox() { lightbox.hidden = true; document.body.style.overflow = ''; }
  function move(delta) { currentIndex = (currentIndex + delta + currentWorks.length) % currentWorks.length; updateLightbox(); }

  lightbox.querySelector('[data-lightbox-close]').addEventListener('click', closeLightbox);
  lightbox.querySelector('[data-lightbox-prev]').addEventListener('click', () => move(-1));
  lightbox.querySelector('[data-lightbox-next]').addEventListener('click', () => move(1));
  lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (event) => {
    if (lightbox.hidden) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') move(-1);
    if (event.key === 'ArrowRight') move(1);
  });

  render();
})();
