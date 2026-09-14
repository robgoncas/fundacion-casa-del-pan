(() => {
  const DATA_PATH = 'assets/data/eventos.json';
  const form = document.querySelector('#event-form');
  if (!form) return;

  const coverInput = document.querySelector('#event-cover');
  const galleryInput = document.querySelector('#event-gallery');
  const preview = document.querySelector('#image-preview');
  const feedback = document.querySelector('#admin-feedback');
  let coverFile = null;
  let galleryFiles = [];
  let storedEvents = [];

  const fallbackEvents = [{
    id: 'subasta-arte-solidaridad',
    slug: 'subasta-arte-solidaridad',
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

  function slugify(value) {
    return value.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'evento';
  }

  function extensionFor(file) {
    const extension = file.name.split('.').pop().toLowerCase();
    return /^[a-z0-9]+$/.test(extension) ? extension : 'jpg';
  }

  function setFeedback(message, type = 'info') {
    feedback.textContent = message;
    feedback.dataset.type = type;
  }

  function renderPreview() {
    const files = [...(coverFile ? [coverFile] : []), ...galleryFiles];
    if (!files.length) {
      preview.innerHTML = '<p>Aún no se han seleccionado imágenes.</p>';
      return;
    }
    preview.innerHTML = files.map((file, index) => {
      const label = coverFile && index === 0 ? 'Portada' : `Foto ${coverFile ? index : index + 1}`;
      return `<figure><img src="${URL.createObjectURL(file)}" alt="Vista previa de ${file.name}"><figcaption><strong>${label}</strong><span>${file.name}</span></figcaption></figure>`;
    }).join('');
  }

  async function loadEvents() {
    try {
      const response = await fetch(DATA_PATH, { cache: 'no-store' });
      if (!response.ok) throw new Error('No se pudo leer el archivo de eventos.');
      storedEvents = await response.json();
    } catch {
      storedEvents = [...fallbackEvents];
      setFeedback('Modo local: al guardar se conservará la subasta inicial y se agregará el nuevo evento.', 'info');
    }
  }

  function readForm() {
    const data = new FormData(form);
    return {
      title: data.get('title').trim(),
      subtitle: data.get('subtitle').trim(),
      date: data.get('date'),
      startTime: data.get('startTime'),
      endTime: data.get('endTime'),
      location: data.get('location').trim(),
      description: data.get('description').trim(),
      published: document.querySelector('#event-published').checked
    };
  }

  function buildEvent(data, slug, coverPath, gallery) {
    return {
      id: slug,
      slug,
      title: data.title,
      subtitle: data.subtitle,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      location: data.location,
      description: data.description,
      cover: coverPath,
      detailUrl: `evento.html?slug=${encodeURIComponent(slug)}`,
      gallery,
      status: data.published ? 'published' : 'draft'
    };
  }

  function sortEvents(events) {
    return [...events].sort((first, second) => first.date.localeCompare(second.date));
  }

  function mergeEvent(events, event) {
    return events.some((item) => item.slug === event.slug)
      ? events.map((item) => item.slug === event.slug ? event : item)
      : [...events, event];
  }

  async function writeTextFile(directory, path, content) {
    const parts = path.split('/');
    const fileName = parts.pop();
    let current = directory;
    for (const part of parts) current = await current.getDirectoryHandle(part, { create: true });
    const handle = await current.getFileHandle(fileName, { create: true });
    const writable = await handle.createWritable();
    await writable.write(content);
    await writable.close();
    const writtenFile = await handle.getFile();
    if ((await writtenFile.text()) !== content) throw new Error(`No se pudo verificar ${path}.`);
  }

  async function writeBinaryFile(directory, path, file) {
    const parts = path.split('/');
    const fileName = parts.pop();
    let current = directory;
    for (const part of parts) current = await current.getDirectoryHandle(part, { create: true });
    const handle = await current.getFileHandle(fileName, { create: true });
    const writable = await handle.createWritable();
    await writable.write(await file.arrayBuffer());
    await writable.close();
  }

  function downloadFile(name, content, type) {
    const blob = content instanceof Blob ? content : new Blob([content], { type });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = name;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function downloadJson() {
    const data = readForm();
    if (!data.title || !data.date) {
      setFeedback('Completa al menos el título y la fecha antes de descargar.', 'error');
      return;
    }
    const slug = slugify(data.title);
    const event = buildEvent(data, slug, `assets/images/eventos/${slug}/portada.jpg`, []);
    downloadFile('eventos.json', JSON.stringify(sortEvents([...storedEvents, event]), null, 2), 'application/json');
    setFeedback('JSON descargado. Guarda las imágenes dentro de la carpeta indicada en la ayuda.', 'success');
  }

  async function saveEvent(event) {
    if (!window.showDirectoryPicker) throw new Error('Tu navegador no permite escribir carpetas directamente.');
    const projectDirectory = await window.showDirectoryPicker({ mode: 'readwrite' });
    try {
      await projectDirectory.getDirectoryHandle('assets');
    } catch {
      throw new Error('Selecciona la carpeta raíz del proyecto: debe contener la carpeta assets.');
    }
    const slug = event.slug;
    const eventDirectory = `assets/images/eventos/${slug}`;
    const allFiles = [...(coverFile ? [coverFile] : []), ...galleryFiles];
    for (const [index, file] of allFiles.entries()) {
      const isCover = coverFile && index === 0;
      const fileName = isCover ? `portada.${extensionFor(file)}` : `foto-${String(coverFile ? index : index + 1).padStart(2, '0')}.${extensionFor(file)}`;
      await writeBinaryFile(projectDirectory, `${eventDirectory}/${fileName}`, file);
    }
    if (!coverFile) {
      await writeBinaryFile(projectDirectory, `${eventDirectory}/portada.${extensionFor(galleryFiles[0])}`, galleryFiles[0]);
    }
    const json = JSON.stringify(sortEvents(mergeEvent(storedEvents, event)), null, 2);
    await writeTextFile(projectDirectory, 'assets/data/eventos.json', `${json}\n`);
  }

  coverInput.addEventListener('change', () => {
    coverFile = coverInput.files[0] || null;
    renderPreview();
  });

  galleryInput.addEventListener('change', () => {
    galleryFiles = [...galleryInput.files];
    renderPreview();
  });

  document.querySelector('#download-json').addEventListener('click', downloadJson);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = readForm();
    if (!data.title || !data.date || !data.location || !data.description) {
      setFeedback('Completa los campos obligatorios antes de publicar.', 'error');
      return;
    }
    if (!coverFile && !galleryFiles.length) {
      setFeedback('Agrega al menos una imagen para crear la carpeta del evento.', 'error');
      return;
    }
    const slug = slugify(data.title);
    const coverExtension = extensionFor(coverFile || galleryFiles[0]);
    const coverPath = `assets/images/eventos/${slug}/portada.${coverExtension}`;
    const gallery = galleryFiles.map((file, index) => ({
      src: `assets/images/eventos/${slug}/foto-${String(coverFile ? index + 1 : index + 1).padStart(2, '0')}.${extensionFor(file)}`,
      alt: `${data.title} - foto ${index + 1}`
    }));
    const newEvent = buildEvent(data, slug, coverPath, gallery);
    try {
      await saveEvent(newEvent);
      storedEvents = sortEvents(mergeEvent(storedEvents, newEvent));
      setFeedback(`Evento creado. Se generaron assets/data/eventos.json y la carpeta assets/images/eventos/${slug}/.`, 'success');
      form.reset();
      document.querySelector('#event-published').checked = true;
      coverFile = null;
      galleryFiles = [];
      renderPreview();
    } catch (error) {
      if (error.name === 'AbortError') {
        setFeedback('Operación cancelada.', 'info');
      } else {
        downloadFile('eventos.json', JSON.stringify(sortEvents(mergeEvent(storedEvents, newEvent)), null, 2), 'application/json');
        setFeedback(`${error.message} Se descargó una copia de eventos.json para reemplazar assets/data/eventos.json.`, 'error');
      }
    }
  });

  loadEvents();
})();
