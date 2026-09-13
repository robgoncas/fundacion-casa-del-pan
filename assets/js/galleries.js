(() => {
  const auctionWorks = [
    'assets/images/obras_subasta/WhatsApp Image 2026-09-08 at 1.07.35 PM.jpeg',
    'assets/images/obras_subasta/WhatsApp Image 2026-09-08 at 1.07.36 PM (1).jpeg',
    'assets/images/obras_subasta/WhatsApp Image 2026-09-08 at 1.07.36 PM.jpeg',
    'assets/images/obras_subasta/WhatsApp Image 2026-09-08 at 1.07.37 PM (1).jpeg',
    'assets/images/obras_subasta/WhatsApp Image 2026-09-08 at 1.07.37 PM.jpeg',
    'assets/images/obras_subasta/WhatsApp Image 2026-09-08 at 1.07.38 PM.jpeg',
    'assets/images/obras_subasta/WhatsApp Image 2026-09-08 at 1.07.39 PM (1).jpeg',
    'assets/images/obras_subasta/WhatsApp Image 2026-09-08 at 1.07.39 PM (2).jpeg',
    'assets/images/obras_subasta/WhatsApp Image 2026-09-08 at 1.07.39 PM (3).jpeg',
    'assets/images/obras_subasta/WhatsApp Image 2026-09-08 at 1.07.39 PM (4).jpeg',
    'assets/images/obras_subasta/WhatsApp Image 2026-09-08 at 1.07.39 PM.jpeg'
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

  const titleFromPath = (path) => decodeURIComponent(path.split('/').pop()).replace(/\.[^.]+$/, '').replace(/^\d+\.\s*/, '');
  const seriesFromPath = (path) => path.includes('obras_subasta') ? 'Obras para la subasta' : path.split('/')[3].replaceAll('_', ' ');
  const descriptionFor = (path) => path.includes('obras_subasta')
    ? 'Obra donada para la Primera Subasta Solidaria de Arte de la Fundación Casa del Pan.'
    : `Obra de la ${seriesFromPath(path).toLowerCase()} de la colección de la Fundación Casa del Pan.`;
  const imagePath = (folder, file) => `assets/images/COLECCION FCP/${folder}/${file}`;
  const allWorks = galleryRoot.dataset.galleryRoot === 'auction'
    ? auctionWorks.map((path) => ({ path, series: 'Obras para la subasta' }))
    : Object.entries(collectionSeries).flatMap(([series, files]) => files.map((file) => ({ path: imagePath(series, file), series })));

  function card(work, index) {
    const title = titleFromPath(work.path);
    const figure = document.createElement('figure');
    figure.className = 'art-card';
    figure.innerHTML = `<button type="button" aria-label="Ver ${title} en pantalla completa"><img loading="lazy" src="${work.path}" alt="${title}" data-index="${index}"><figcaption><span class="art-title">${title}</span><span class="art-meta"><span>${work.series.replace('SERIE ', '')}</span><span data-dimensions>Calculando tamaño...</span></span><p class="art-description">${descriptionFor(work.path)}</p></figcaption></button>`;
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
      section.innerHTML = `<div class="series-heading"><div><span class="gallery-kicker">Serie</span><h2>${series.replace('SERIE ', '')}</h2></div><p>${files.length} obras</p></div><div class="gallery-grid"></div>`;
      const grid = section.querySelector('.gallery-grid');
      files.forEach((file, index) => grid.append(card({ path: imagePath(series, file), series }, allWorks.findIndex((work) => work.path === imagePath(series, file)))));
      seriesContainer.append(section);
    });
  }

  function updateLightbox() {
    const work = currentWorks[currentIndex];
    const title = titleFromPath(work.path);
    lightboxImage.src = work.path;
    lightboxImage.alt = title;
    lightboxTitle.textContent = title;
    lightboxDescription.textContent = descriptionFor(work.path);
    lightboxSize.textContent = 'Cargando dimensiones...';
    lightboxImage.onload = () => { lightboxSize.textContent = `${lightboxImage.naturalWidth} × ${lightboxImage.naturalHeight} px`; };
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
