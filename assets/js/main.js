(() => {
  const primaryHeaderLogo = document.querySelector('header:not(.site-header) img');
  if (primaryHeaderLogo) {
    primaryHeaderLogo.src = 'assets/images/logo.png';
    primaryHeaderLogo.alt = 'Logo de la Fundación Casa del Pan';
  }

  const auctionEvent = {
    title: 'I Subasta Benéfica de Obras de Arte - Arte y Solidaridad',
    start: '20261114T110000',
    end: '20261114T140000',
    location: 'Club Alemán de Valparaíso, Calle Salvador Donoso 1337, Salón Bellavista, segundo piso, acceso universal, Valparaíso, Chile',
    description: 'Subasta benéfica de la Fundación Casa del Pan para financiar el arriendo de su sede comunitaria.'
  };

  function downloadCalendarEvent() {
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Fundacion Casa del Pan//Subasta Benefica//ES',
      'BEGIN:VEVENT',
      `DTSTART;TZID=America/Santiago:${auctionEvent.start}`,
      `DTEND;TZID=America/Santiago:${auctionEvent.end}`,
      `SUMMARY:${auctionEvent.title}`,
      `LOCATION:${auctionEvent.location}`,
      `DESCRIPTION:${auctionEvent.description}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'subasta-casa-del-pan-2026.ics';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function copiarDatosBancarios() {
    const datos = 'Fundación Casa del Pan\nRUT: 65.222.141-6\nBanco Estado\nTipo: Chequera Electrónica\nN° de Cuenta: 240 7019 4178\nCorreo: fun.casadelpan@gmail.com\nAsunto: Donación Solidaria Sede Valparaíso';
    navigator.clipboard.writeText(datos).then(() => {
      const toast = document.getElementById('toast-copiado');
      const btn = document.getElementById('btn-copiar-banco');
      if (!toast || !btn) return;
      toast.classList.remove('hidden');
      btn.classList.add('bg-primary');
      btn.classList.remove('bg-secondary');
      btn.innerHTML = '<span class="material-symbols-outlined text-[20px]">check</span><span>¡Datos Copiados al Portapapeles!</span>';
      setTimeout(() => {
        toast.classList.add('hidden');
        btn.classList.remove('bg-primary');
        btn.classList.add('bg-secondary');
        btn.innerHTML = '<span class="material-symbols-outlined text-[20px]">content_copy</span><span>Copiar Todos los Datos de Transferencia</span>';
      }, 4000);
    }).catch(() => {
      alert('Por favor copia manualmente: RUT 65.222.141-6, Banco Estado Chequera Electrónica N° 240 7019 4178');
    });
  }

  function seleccionarMonto(monto, btn) {
    document.querySelectorAll('.monto-btn').forEach((item) => {
      item.classList.remove('bg-tertiary', 'text-on-tertiary');
      item.classList.add('bg-surface-container-high', 'text-on-surface');
    });
    btn.classList.add('bg-tertiary', 'text-on-tertiary');
    btn.classList.remove('bg-surface-container-high', 'text-on-surface');
    const inputOtro = document.getElementById('input-otro-monto');
    const texto = document.getElementById('texto-impacto');
    if (inputOtro) inputOtro.value = '';
    if (!texto) return;
    const mensajes = {
      5000: 'Con <strong>$5.000 mensuales</strong> podemos disponer de recursos para materiales, movilización, ayudas solidarias y algún evento.',
      10000: 'Con <strong>$10.000 mensuales</strong> cubres materiales para el taller de Papel Artesanal y 1 colación comunitaria de cierre ritual.',
      20000: 'Con <strong>$20.000 mensuales</strong> financias la atención de arteterapia especializada semanal y textos en Braille.'
    };
    texto.innerHTML = mensajes[monto] || texto.innerHTML;
  }

  function montoManual(valor) {
    document.querySelectorAll('.monto-btn').forEach((btn) => {
      btn.classList.remove('bg-tertiary', 'text-on-tertiary');
      btn.classList.add('bg-surface-container-high', 'text-on-surface');
    });
    const texto = document.getElementById('texto-impacto');
    if (!texto) return;
    texto.innerHTML = valor > 0
      ? `Tu aporte personalizado de <strong>$${Number(valor).toLocaleString('es-CL')} CLP</strong> va directo al fondo solidario de arriendo de Av. Francia 739.`
      : 'Cada aporte suma para sostener nuestros 8 talleres inclusivos en Valparaíso.';
  }

  function setFrecuencia(tipo) {
    const mensual = document.getElementById('btn-mensual');
    const unica = document.getElementById('btn-unica');
    if (!mensual || !unica) return;
    const activo = 'py-space-xs rounded-lg bg-primary-container text-on-primary font-label-md text-label-md transition-all shadow-sm';
    const inactivo = 'py-space-xs rounded-lg text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-all';
    mensual.className = tipo === 'mensual' ? activo : inactivo;
    unica.className = tipo === 'unica' ? activo : inactivo;
  }

  function filtrarTalleres(categoria) {
    const botones = document.querySelectorAll('.filter-btn');
    botones.forEach((btn) => {
      const activo = btn.dataset.category === categoria;
      btn.classList.toggle('bg-primary', activo);
      btn.classList.toggle('text-on-primary', activo);
      btn.classList.toggle('bg-surface-container', !activo);
      btn.classList.toggle('text-on-surface-variant', !activo);
    });
    document.querySelectorAll('.taller-card').forEach((card) => {
      card.style.display = categoria === 'todos' || card.classList.contains(categoria) ? 'flex' : 'none';
    });
  }

  function enviarFormulario(event) {
    event.preventDefault();
    const feedback = document.getElementById('form-feedback');
    const form = document.getElementById('form-contacto');
    if (feedback) feedback.classList.remove('hidden');
    if (form) form.reset();
  }

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
      const backdrop = document.getElementById(drawer.id + '-backdrop') || document.querySelector('.mobile-nav-backdrop');
      if (backdrop) {
        backdrop.hidden = false;
      }
      toggleButtons.forEach((button) => {
        button.setAttribute('aria-expanded', button.closest('.mobile-nav-drawer') === drawer ? 'true' : 'false');
      });
    };

    toggleButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const targetId = button.getAttribute('aria-controls');
        const drawer = document.getElementById(targetId);
        if (!drawer) return;
        const isOpen = drawer.classList.contains('is-open');
        if (isOpen) {
          closeMenus();
        } else {
          openMenu(drawer);
        }
      });
    });

    closeButtons.forEach((button) => {
      button.addEventListener('click', closeMenus);
    });

    backdrops.forEach((backdrop) => {
      backdrop.addEventListener('click', closeMenus);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenus();
    });
  }

  setupMobileMenu();

  function setupAccessibilityPanel() {
    const toggle = document.querySelector('[data-accessibility-toggle]');
    const panel = document.querySelector('#accessibility-panel');
    const close = document.querySelector('[data-accessibility-close]');
    const reset = document.querySelector('[data-accessibility-reset]');
    const status = document.querySelector('[data-accessibility-status]');
    const options = document.querySelectorAll('[data-accessibility-option]');
    if (!toggle || !panel) return;

    const storageKey = 'casa-del-pan-accessibility';
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');

    const applyOption = (option, enabled) => {
      document.body.classList.toggle(`accessibility-${option}`, enabled);
    };

    options.forEach((input) => {
      input.checked = Boolean(saved[input.dataset.accessibilityOption]);
      applyOption(input.dataset.accessibilityOption, input.checked);
      input.addEventListener('change', () => {
        const values = Object.fromEntries([...options].map((item) => [item.dataset.accessibilityOption, item.checked]));
        localStorage.setItem(storageKey, JSON.stringify(values));
        applyOption(input.dataset.accessibilityOption, input.checked);
        if (status) status.textContent = `${input.parentElement.querySelector('strong').textContent}: ${input.checked ? 'activado' : 'desactivado'}.`;
      });
    });

    const closePanel = () => {
      panel.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', () => {
      panel.hidden = !panel.hidden;
      toggle.setAttribute('aria-expanded', String(!panel.hidden));
      if (!panel.hidden) panel.querySelector('input')?.focus();
    });
    close?.addEventListener('click', closePanel);
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !panel.hidden) {
        closePanel();
        toggle.focus();
      }
    });
    reset?.addEventListener('click', () => {
      options.forEach((input) => {
        input.checked = false;
        applyOption(input.dataset.accessibilityOption, false);
      });
      localStorage.removeItem(storageKey);
      if (status) status.textContent = 'Opciones restablecidas.';
    });
  }

  setupAccessibilityPanel();

  window.downloadCalendarEvent = downloadCalendarEvent;
  window.copiarDatosBancarios = copiarDatosBancarios;
  window.seleccionarMonto = seleccionarMonto;
  window.montoManual = montoManual;
  window.setFrecuencia = setFrecuencia;
  window.filtrarTalleres = filtrarTalleres;
  window.enviarFormulario = enviarFormulario;
})();
