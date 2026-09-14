(() => {
  const upcomingList = document.querySelector('#upcoming-events-list');
  const previousList = document.querySelector('#previous-events-list');
  const count = document.querySelector('#events-count');
  const updated = document.querySelector('#events-updated');
  const upcomingCount = document.querySelector('#upcoming-events-count');
  const previousCount = document.querySelector('#previous-events-count');
  if (!upcomingList || !previousList) return;

  const fallbackEvents = [{
    title: 'I Subasta Benéfica de Obras de Arte',
    subtitle: 'Arte y Solidaridad',
    date: '2026-11-14',
    startTime: '11:00',
    endTime: '14:00',
    location: 'Club Alemán de Valparaíso, Salvador Donoso 1337',
    description: 'Una jornada para encontrarnos alrededor del arte y reunir recursos para sostener el arriendo anual de nuestra sede comunitaria en Avenida Francia.',
    cover: 'assets/images/logo-evento-subasta.jpeg',
    detailUrl: 'obras-subastas.html',
    gallery: [],
    status: 'published'
  }];

  const formatDate = (date) => new Intl.DateTimeFormat('es-CL', {
    day: 'numeric', month: 'short', year: 'numeric'
  }).format(new Date(`${date}T12:00:00`));

  const statusFor = (date) => date >= new Date().toISOString().slice(0, 10) ? 'Próximo evento' : 'Evento realizado';

  function addText(parent, tag, className, text) {
    const element = document.createElement(tag);
    element.className = className;
    element.textContent = text || '';
    parent.append(element);
    return element;
  }

  function renderEvent(event) {
      const article = document.createElement('article');
      article.className = 'event-item';
      const imageWrap = document.createElement('div');
      imageWrap.className = 'event-item-image';
      const image = document.createElement('img');
      image.src = event.cover;
      image.alt = `Portada de ${event.title}`;
      imageWrap.append(image);
      const content = document.createElement('div');
      content.className = 'event-item-content';
      const topline = document.createElement('div');
      topline.className = 'event-item-topline';
      addText(topline, 'span', 'event-status', statusFor(event.date));
      addText(topline, 'span', 'event-date', formatDate(event.date));
      content.append(topline);
      addText(content, 'h3', '', event.title);
      addText(content, 'p', 'event-subtitle', event.subtitle);
      addText(content, 'p', '', event.description);
      const facts = document.createElement('dl');
      facts.className = 'event-facts';
      const schedule = document.createElement('div');
      addText(schedule, 'dt', '', 'Horario');
      addText(schedule, 'dd', '', [event.startTime, event.endTime].filter(Boolean).join(' a ') || 'Horario por confirmar');
      const location = document.createElement('div');
      addText(location, 'dt', '', 'Lugar');
      addText(location, 'dd', '', event.location);
      facts.append(schedule, location);
      content.append(facts);
      const link = document.createElement('a');
      link.className = 'event-detail-link';
      link.href = event.detailUrl || `evento.html?slug=${encodeURIComponent(event.slug)}`;
      link.append(document.createTextNode(event.gallery?.length ? 'Ver evento y galería ' : 'Ver detalle del evento '));
      const icon = document.createElement('span');
      icon.className = 'material-symbols-outlined';
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = 'arrow_forward';
      link.append(icon);
      content.append(link);
      article.append(imageWrap, content);
      return article;
  }

  function renderGroup(list, countElement, events, emptyMessage) {
    list.replaceChildren();
    countElement.textContent = `${events.length} evento${events.length === 1 ? '' : 's'}`;
    if (!events.length) {
      addText(list, 'p', 'events-empty', emptyMessage);
      return;
    }
    events.forEach((event) => list.append(renderEvent(event)));
  }

  function render(events) {
    const today = new Date().toISOString().slice(0, 10);
    const publishedEvents = events.filter((event) => event.status !== 'draft');
    const upcomingEvents = publishedEvents
      .filter((event) => event.date >= today)
      .sort((first, second) => second.date.localeCompare(first.date));
    const previousEvents = publishedEvents
      .filter((event) => event.date < today)
      .sort((first, second) => second.date.localeCompare(first.date));
    count.textContent = `${publishedEvents.length} evento${publishedEvents.length === 1 ? '' : 's'} publicado${publishedEvents.length === 1 ? '' : 's'}`;
    renderGroup(upcomingList, upcomingCount, upcomingEvents, 'No hay próximos eventos publicados.');
    renderGroup(previousList, previousCount, previousEvents, 'No hay eventos anteriores publicados.');
  }

  fetch('assets/data/eventos.json', { cache: 'no-store' })
    .then((response) => {
      if (!response.ok) throw new Error('No se pudo leer eventos.json');
      return response.json();
    })
    .then(render)
    .catch(() => render(fallbackEvents));
  updated.textContent = 'Los eventos se ordenan automáticamente por fecha';
})();
