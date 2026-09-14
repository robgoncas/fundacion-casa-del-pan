(() => {
  const root = document.querySelector('#event-detail');
  const slug = new URLSearchParams(window.location.search).get('slug');
  if (!root || !slug) {
    root.innerHTML = '<p class="events-empty">No se indicó un evento válido.</p>';
    return;
  }

  const formatDate = (date) => new Intl.DateTimeFormat('es-CL', {
    day: 'numeric', month: 'long', year: 'numeric'
  }).format(new Date(`${date}T12:00:00`));

  function render(event) {
    document.title = `${event.title} | Fundación Casa del Pan`;
    root.replaceChildren();
    const back = document.createElement('a');
    back.className = 'event-detail-link event-back-link';
    back.href = 'eventos.html';
    back.textContent = 'Volver a la lista de eventos';
    root.append(back);
    const hero = document.createElement('section');
    hero.className = 'gallery-hero event-detail-hero';
    const kicker = document.createElement('span');
    kicker.className = 'gallery-kicker';
    kicker.textContent = formatDate(event.date);
    hero.append(kicker);
    const title = document.createElement('h1');
    title.textContent = event.title;
    hero.append(title);
    if (event.subtitle) {
      const subtitle = document.createElement('p');
      subtitle.className = 'event-subtitle';
      subtitle.textContent = event.subtitle;
      hero.append(subtitle);
    }
    const description = document.createElement('p');
    description.textContent = event.description;
    hero.append(description);
    root.append(hero);
    const facts = document.createElement('dl');
    facts.className = 'event-detail-facts';
    const schedule = document.createElement('div');
    const scheduleLabel = document.createElement('dt');
    scheduleLabel.textContent = 'Horario';
    const scheduleValue = document.createElement('dd');
    scheduleValue.textContent = [event.startTime, event.endTime].filter(Boolean).join(' a ') || 'Por confirmar';
    schedule.append(scheduleLabel, scheduleValue);
    const location = document.createElement('div');
    const locationLabel = document.createElement('dt');
    locationLabel.textContent = 'Lugar';
    const locationValue = document.createElement('dd');
    locationValue.textContent = event.location;
    location.append(locationLabel, locationValue);
    facts.append(schedule, location);
    root.append(facts);
    if (event.gallery?.length) {
      const section = document.createElement('section');
      section.className = 'series-section event-gallery-section';
      const heading = document.createElement('div');
      heading.className = 'series-heading';
      const headingWrap = document.createElement('div');
      const headingKicker = document.createElement('span');
      headingKicker.className = 'gallery-kicker';
      headingKicker.textContent = 'Registro del evento';
      const headingTitle = document.createElement('h2');
      headingTitle.textContent = 'Galería';
      headingWrap.append(headingKicker, headingTitle);
      heading.append(headingWrap);
      const count = document.createElement('p');
      count.textContent = `${event.gallery.length} fotos`;
      heading.append(count);
      section.append(heading);
      const grid = document.createElement('div');
      grid.className = 'event-photo-grid';
      event.gallery.forEach((photo) => {
        const figure = document.createElement('figure');
        const image = document.createElement('img');
        image.src = photo.src;
        image.alt = photo.alt || event.title;
        figure.append(image);
        grid.append(figure);
      });
      section.append(grid);
      root.append(section);
    }
  }

  fetch('assets/data/eventos.json', { cache: 'no-store' })
    .then((response) => {
      if (!response.ok) throw new Error('No se pudo leer eventos.json');
      return response.json();
    })
    .then((events) => {
      const event = events.find((item) => item.slug === slug);
      if (!event) throw new Error('Evento no encontrado');
      render(event);
    })
    .catch(() => {
      root.innerHTML = '<p class="events-empty">No fue posible cargar este evento. Abre el sitio desde un servidor local para leer el archivo de datos.</p>';
    });
})();
