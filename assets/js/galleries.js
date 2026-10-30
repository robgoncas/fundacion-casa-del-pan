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
    'assets/images/obras_subasta/obra11.jpeg',
    'assets/images/obras_subasta/obra12.jpeg',
    'assets/images/obras_subasta/obra13.jpeg',
    'assets/images/obras_subasta/obra14.jpeg',
    'assets/images/obras_subasta/obra15.jpeg',
    'assets/images/obras_subasta/obra16.jpeg',
    'assets/images/obras_subasta/obra17.jpeg',
    'assets/images/obras_subasta/obra18.jpeg',
    'assets/images/obras_subasta/obra19.jpeg',
    'assets/images/obras_subasta/obra20.jpeg'
  ];

  const collectionSeries = {
    'SERIE CON_TACTO': [
      '47. La Caja de Pandora.JPG', '48. Homenaje a Luis Braille.jpg', '49. Estrella de Amar.jpg',
      '50. Para tus yemas.jpg', '51. Pecado y perdón.jpg', '52. Incógnita.jpg', '53. Esferas en un espacio virtual.jpg'
    ],
    'SERIE DESDE LA CRUZ': [
      '37. Deriva 1.jpg', '38. Deriva 2.bmp', '39. Desolación.jpg', '40. Descubre la luz.jpg', '41. Descansa en Él.jpg',
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
      '1. Pan y Cielo.bmp', '2. El río de la sangre.jpg', '3. El fantasma.jpeg', '4. Luna.bmp',
      '5. Los Visitantes.jpg', '6. Ventana Móvil.bmp', '7. Antiguos Escritos.jpg',
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
  const lightboxMeta = lightbox.querySelector('[data-lightbox-meta]');
  const lightboxDescription = lightbox.querySelector('[data-lightbox-description]');
  const lightboxSize = lightbox.querySelector('[data-lightbox-size]');
  const lightboxSizeContainer = lightboxSize.closest('p');
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
      size: '29,5 × 24 cm',
      description: `Copia basada en la famosa obra de Alberto Durero (La liebre, 1502):

Técnica y textura: La obra captura de manera muy detallada el complejo entramado de trazos cortos y superpuestos que caracterizan el pelaje del animal, logrando una excelente sensación de volumen y densidad.

Monocromía: El uso de un tono rojizo/marrón aporta una calidez particular a la pieza, evocando el aspecto de un dibujo clásico a la sanguina.

Homenaje y autoría: Se aprecia con respeto el monograma clásico de Durero junto con el año original (1502), elegantemente complementado por la firma de la autora (Glori Rivera) y la fecha de ejecución actual en la parte inferior.`
    },
    obra1: {
      title: 'Conversación',
      author: 'Iván Contardo',
      technique: 'Acrílico sobre tela',
      size: '84x100 cm',
      description: `La pintura titulada "Conversación" (firmada por Contardo en la esquina inferior derecha) destaca por una fuerte impronta expresionista y simbólica:

Composición y Encuentro: Muestra dos perfiles humanos enfrentados en una cercanía íntima sobre un fondo azul profundo, lo que enfatiza el diálogo como un ejercicio de profunda atención mutua y reflexión.

Uso del Color: La paleta contrasta tonos cálidos y vibrantes (como el rosa, el rojo y el naranja) en los rostros con la frialdad del fondo azul, dotando a la escena de una atmósfera psicológica e introspectiva.

Sentido Solidario: Al haber sido elegida como imagen para una subasta de este carácter, la obra adquiere una capa metafórica adicional: el arte como un puente de comunicación, empatía y conexión humana capaz de movilizar ayuda hacia quienes más lo necesitan.`
    },
    'Pan y Cielo': { author: '', technique: '', size: '' },
    Luna: { author: '', technique: '', size: '' },
    'Ventana Móvil': { author: '', technique: '', size: '' },
    'Deriva 2': { author: '', technique: '', size: '' },
    obra13: {
      title: 'En estas soledades encantados',
      author: 'Iván Contardo',
      technique: 'Acrílico, esmalte y collage',
      size: '78×79,5 cm.',
      year: '2016',
      description: `Esta obra pictórica de técnica mixta presenta un lenguaje visual abstracto y estructurado, donde se combinan elementos geométricos, texturas y diversas materialidades.

A continuación, se detallan sus aspectos más destacados:

Composición y Geometría: El plano está dividido verticalmente en secciones contrastantes. En el lado izquierdo predominan los bloques y cuadrículas, destacando un gran círculo central que superpone formas reticuladas en tonos cálidos (naranjas y rojos) sobre un fondo oscuro.

Uso de la Técnica Mixta: La obra integra pintura tradicional con elementos de collage o texturas superpuestas, especialmente visible en las franjas verticales de la derecha que imitan patrones textiles o papeles tapiz decorativos, así como pequeños elementos metálicos o tridimensionales insertos.

Color y Contraste: Se observa un juego dinámico entre colores fríos (azules, grises, negros) y cálidos (rojos, naranjas, amarillos), lo que genera tensiones visuales y puntos de enfoque dinámicos.

Firma: En la sección inferior derecha, sobre las franjas texturizadas, se aprecia la firma del autor: CONTARDO.`
    },
    obra3: {
      title: 'Tercera dimensión',
      series: 'Viaje Astral',
      author: 'Adamus',
      technique: 'Acrílico sobre tela',
      size: '84x100 cm',
      description: 'Esta obra de la serie Viaje astral captura magistralmente la transición entre el plano físico y el sutil a través de una intensa atmósfera de tonos cálidos y rojizos que envuelven un paisaje desértico y onírico. En la composición se observa la dualidad de la experiencia: un cuerpo yerto o reposando en la tierra mientras su contraparte energética y translúcida asciende y flota libremente en dirección a un horizonte dominado por montañas y una luna tenue. El uso de texturas fluidas y pinceladas vibrantes refuerza la sensación de desmaterialización, invitando al espectador a reflexionar sobre la trascendencia del alma, la conciencia y la infinitud del cosmos.'
    },
    obra4: {
      title: 'Desdoblamiento XVI',
      author: 'Iván Contardo',
      technique: 'Acrílico sobre tela',
      size: '100x84 cm.',
      description: 'Esta pintura acrílica presenta un potente retrato de perfil de una figura humana de tez pálida y rasgos marcados, la cual se proyecta hacia arriba con una expresión de intensa emoción o súplica. La figura está enmarcada por un fondo de un azul profundo e intenso que contrasta fuertemente con los tonos cálidos y luminosos de la piel, mientras que las líneas diagonales de los brazos extendidos y los sutiles toques de naranja a los costados dinamizan la composición, firmada por "Contardo" en la esquina inferior izquierda.'
    },
    obra5: {
      author: 'Iván Contardo',
      description: 'Esta pintura abstracta destaca por una rica paleta dominada por tonalidades azules y celestes que evocan una atmósfera acuática o atmosférica, en la cual flotan formas orgánicas y fragmentadas con matices verdes, blancos y amarillos que sugieren la presencia de minerales, cristales o elementos naturales en suspensión. La pincelada fluida y el juego de contrastes lumínicos aportan una sensación de dinamismo y ingravidez, invitando al espectador a un viaje introspectivo a través de paisajes oníricos e imaginarios.'
    },
    obra2: {
      title: 'El Ojo de Dios',
      author: 'Iván Contardo',
      technique: 'Oleo sobre tela',
      size: '76x82,5 cm.',
      year: '2004',
      description: 'La obra abstracta titulada «El ojo de Dios» cautiva a primera vista por su potente uso del color y el dinamismo de sus formas, las cuales evocan una fuerza cósmica o estelar en constante movimiento. En el centro, una forma luminosa en tonos amarillos y anaranjados actúa como un núcleo radiante que simula una mirada o un astro celestial, contrastando armoniosamente con la intensidad de los rojos profundos y los fluidos tonos azules que se dispersan como nebulosas a través del lienzo. La textura y la superposición de pinceladas logran una atmósfera mística y envolvente, sugiriendo el origen de la creación o una visión trascendental que invita al espectador a una profunda reflexión introspectiva.'
    },
    obra6: {
      title: 'D-15 / Cósmico',
      author: 'Iván Contardo',
      technique: 'Acrílico sobre tela',
      size: '100x84 cm.',
      description: 'Esta obra surrealista de Contardo captura con gran fuerza poética la comunión entre la interioridad humana y la vastedad cósmica, mostrando a una figura humanoide con los brazos en alto que parece dar vida o sostener esferas celestes y burbujas de luz sobre un fondo de profundos tonos verdes y rojizos. La atmósfera onírica y la paleta monocromática transmiten una sensación de trascendencia y búsqueda espiritual, donde el individuo se funde con el universo en un acto de creación, asombro y control sobre su propio destino onírico.'
    },
    obra8: {
      author: 'Iván Contardo',
      description: 'Esta obra pictórica abstracta, firmada por Contardo, despliega una intensa composición gestual donde convergen la fuerza de la naturaleza y una profunda carga emocional. La paleta cromática transita desde los tonos fríos y profundos de azules y añejos en la sección derecha e inferior, hasta un vibrante y luminoso despliegue de verdes, blancos y destellos amarillos en el sector izquierdo. En el núcleo central se entrelazan tramas oscuras con acentos de rojo encendido que actúan como un foco de tensión, sugiriendo un núcleo energético o volcánico cubierto por capas texturizadas. El uso dinámico de las pinceladas y la superposición de planos otorgan a la pieza un fuerte sentido de movimiento orgánico, evocando un paisaje submarino, una masa rocosa esculpida por elementos telúricos o una introspección psicológica sumergida en la penumbra y la luz.'
    },
    obra9: {
      title: 'Deriva II',
      series: 'Desde la Cruz',
      author: 'Iván Contardo',
      technique: 'Acrílico sobre tela',
      size: '100x84cm',
      description: 'Esta obra de la serie Desde la Cruz de Contardo presenta una profunda atmósfera de introspección y desolación, dominada por una paleta monocromática de grises y blancos que evoca un paisaje etéreo o suspendido en el vacío. En el centro compositivo se alza una cruz de madera de formas robustas y angulares, la cual parece flotar o hundirse en un torbellino dinámico de trazos curvos y líneas sinuosas que recorren el fondo pictórico, sugiriendo tanto movimiento como turbulencia emocional. A través de este contraste entre la solidez geométrica del símbolo religioso y la fluidez caótica del entorno, el artista logra transmitir una poderosa sensación de aislamiento, resistencia espiritual y contemplación silenciosa.'
    },
    obra10: {
      title: 'Tango',
      author: 'Ivan Contardo',
      technique: 'Oleo sobre tela',
      size: '81×78 cm.',
      description: 'Esta obra pictórica titulada Tango, firmada por Contardo, propone una reinterpretación abstracta y geométrica de la esencia urbana y pasional de este género musical, donde las formas fragmentadas en tonos cálidos y rojizos flotan y dialogan sobre un profundo fondo nocturno de azules intensos salpicados de luces, evocando el movimiento sincopado y la atmósfera melancólica de una ciudad en plena noche.'
    },
    obra11: {
      author: 'Iván Contardo',
      description: `Esta obra pictórica, firmada por CONTARDO en el margen inferior izquierdo, presenta una escena de gran dinamismo corporal sobre un fondo naranja intenso. La composición se estructura mediante diagonales marcadas que sugieren caída o ingravidez, donde dos figuras humanas de tonos fríos (grisáceos y blanquecinos) entablan un complejo diálogo físico de escorzos y gestos expresivos.

El vibrante fondo cálido contrasta fuertemente con la paleta de los cuerpos y actúa como un catalizador emocional que transmite energía o tensión. En conjunto, la contraposición entre ambas figuras evoca una profunda metáfora sobre la dualidad humana, la lucha interna y la tensión entre la materia y el espíritu.`
    },
    obra12: {
      title: 'Sujeto y movimiento',
      author: 'Iván Contardo',
      size: 'Aún no informado',
      description: `La pintura muestra una figura humana arqueada en suspensión, con una postura diagonal y extremidades extendidas que transmiten una sensación de ingravidez, caída o inmersión fluida.

Color y atmósfera: Predominan los tonos azules y añiles que evocan un entorno acuático o nocturno, contrastados por sutiles luces verdosas y amarillentas que dan volumen y perfilan la silueta.`
    },
    obra14: {
      title: 'Inicios',
      author: 'Juan Delsante Gutierrez',
      technique: 'Escultura en resina, mármol y bronce',
      size: '39x30x9,7 cm.',
      year: '1980',
      description: `Esta obra destaca por su fuerte sentido geométrico y su juego de contrastes visuales y matéricos. A continuación, se presenta un breve comentario sobre sus aspectos más sobresalientes:

Dualidad cromática y de materiales: La pieza establece un diálogo formal entre la oscuridad y la pesadez visual de la estructura exterior oscura —de aspecto monolítico y acabado sobrio— y la luminosidad del núcleo central en tono claro (similar al mármol o piedra pulida).

Ritmo y tensión estructural: Los aros metálicos dispuestos de manera horizontal a lo largo de la hendidura central actúan como un elemento de unión o costura visual. Estos aros generan un ritmo visual constante y sugieren una sensación de tensión, como si contuvieran o protegieran el núcleo interior.

Estética constructivista e industrial: Las líneas rectas, la forma trapezoidal del bloque y la incorporación de metal sugieren influencias del constructivismo o del arte moderno con tintes industriales, donde la precisión de las formas y la interacción entre los distintos planos tridimensionales cobran el protagonismo absoluto.`
    },
    obra15: {
      author: 'Jessica Neira',
      technique: 'Óleo sobre tela',
      size: 'Aún no informado',
      description: `Esta obra al óleo sobre tela de Jessica Neira captura de manera muy evocativa la esencia urbana y pintoresca de los cerros de Valparaíso, Chile.

Algunos comentarios y detalles destacados sobre la composición y el estilo:

Protagonismo y atmósfera: En primer plano, la figura de un perrito sentado pacientemente sobre una estructura aporta un toque tierno, melancólico y muy característico de las calles porteñas, donde los animales forman parte cotidiana del paisaje. Su mirada directa hacia el espectador genera una conexión emocional inmediata.

Composición y perspectiva: La obra utiliza una perspectiva en descenso que guía la mirada a través de una escalera o pasaje estrecho bordeado por casas típicas con arquitectura tradicional de los cerros.

Uso del color y entorno: Los tonos tierra, ocres y pasteles de las viviendas de la derecha contrastan sutilmente con los edificios más sobrios de la izquierda, mientras que al fondo se abre la clásica postal de la bahía de Valparaíso con el mar y algunos botes flotando en el horizonte.

Textura y técnica: Se aprecian pinceladas texturizadas, especialmente en el pelaje del perro y en los volúmenes de las construcciones, lo que otorga corporeidad y dinamismo a la superficie de la tela.

Es una hermosa representación costumbrista que rinde homenaje a la identidad visual, la arquitectura escalonada y la atmósfera bohemia de Valparaíso.`
    },
    obra16: {
      title: 'Lennon',
      author: 'Carlos De Los Ríos',
      technique: 'Dibujo a plumilla',
      size: '27cm x22 cm',
      description: `Esta obra gráfica enmarcada es un impresionante dibujo a tinta que presenta un retrato de estilo surrealista y conceptual de John Lennon. Está firmado en el lateral derecho por Carlos de los Ríos y fechado en 89 (1989).

Análisis y Composición

Técnica y Estilo: Está ejecutado monocromáticamente con trazos detallados de tinta negra sobre papel. Utiliza la técnica del dibujo de contorno y el puntillismo/sombrazos de líneas para integrar múltiples elementos dentro de una sola figura principal (estilo conocido como arte de doble exposición o composición de elementos ocultos).

El Retrato Principal: La silueta y el rostro reconocibles de John Lennon con sus característicos lentes redondos actúan como el contenedor visual de toda la narración gráfica.

Simbolismo e Iconografía: Dentro del cabello, el rostro y los contornos se despliegan diversos elementos alegóricos y psicodélicos muy acordes con la época y el legado pacifista y artístico de Lennon:

Palomas de la paz: Ubicadas en la parte inferior y superior izquierda, simbolizando su conocido activismo por la paz.

Instrumentos musicales y naturaleza: Se aprecian guitarras, aves en vuelo, paisajes montañosos, cataratas y flora que fluyen como parte de su mente y espíritu creativos.

Detalles oníricos: Reflejos en los lentes y formas abstractas que sugieren un flujo de conciencia, mundos internos y un homenaje a la estética de los años 60 y 70.

Es una pieza de colección muy nostálgica y detallada que demuestra un gran dominio del trazo a mano alzada y una profunda inspiración en la figura del ex-Beatle.`
    },
    obra17: {
      author: 'Iván Contardo',
      size: 'Aún no informado',
      description: `Esta obra pictórica de estilo abstracto y constructivista presenta una compleja estructuración geométrica dividida en múltiples cuadrículas, celdas y planos superpuestos. La composición se organiza mediante fuertes líneas oscuras que delimitan diferentes texturas y zonas de color, recordando a un mosaico urbano o a una retícula arquitectónica fragmentada.

En cuanto al uso del color y los elementos visuales, conviven tonalidades frías como los azules y grises en la parte inferior izquierda con contrastes cálidos de rojos, ocres y verdes intensos distribuidos por el resto del plano. Hacia el sector inferior derecho, la firma "CONTARDO" sella la pieza junto a detalles texturizados que aportan dinamismo y profundidad a esta superficie pictórica de carácter matérico y orden riguroso.`
    },
    obra18: {
      author: 'Iván Contardo',
      size: 'Aún no informado',
      description: 'Esta obra pictórica del artista Contardo se enmarca dentro del arte contemporáneo de estilo abstracto y expresionista, destacando por el uso de una técnica mixta de texturas densas y pinceladas vigorosas. La composición está dominada por una paleta profunda de tonos oscuros y azules nocturnos que contrastan con destellos de luz en gamas cálidas como el rojo, el ocre y el amarillo, sugiriendo una atmósfera onírica o un paisaje interior cargado de misterio. Asimismo, la presencia de elementos geométricos fragmentados, formas circulares que evocan cuerpos celestes o relojes y la firma visible en el margen inferior derecho otorgan a la pieza un fuerte carácter simbólico sobre el tiempo, el espacio y la dualidad emocional.'
    },
    obra19: {
      author: 'Iván Contardo',
      technique: 'Acrílico',
      size: 'Aún no informado',
      description: 'Esta pintura en acrílico, firmada por Contardo, presenta una figura humana de tonos cálidos suspendida en un espacio dominado por un degradado vertical que transita desde la oscuridad superior hasta un rojo profundo. A través de una pincelada texturizada y un fuerte contraste cromático, la obra transmite una atmósfera de introspección, ingravidez y aislamiento, sugiriendo una transición entre la crisis o la oscuridad y un proceso de transformación interna.'
    },
    obra20: {
      author: 'Iván Contardo',
      size: 'Aún no informado',
      description: `Esta pintura abstracta destaca por el uso expresivo de la textura y una paleta de colores profundamente evocadora.

Composición y atmósfera: La obra presenta una división visual clara. La parte inferior está dominada por tonos oscuros, azules profundos y verdes sombríos que sugieren una base terrenal o nocturna, mientras que la franja superior se ilumina con trazos dinámicos en blancos, verdes claros y destellos amarillos, evocando un cielo tormentoso, el rompimiento de la luz o la energía de la naturaleza.

Técnica: Se aprecian pinceladas densas y empastes marcados que otorgan un fuerte relieve físico y dinamismo al lienzo.

Firma: En la esquina inferior izquierda se observa la firma "CONTARDO", aportando identidad a esta pieza de carácter lírico y atmosférico.`
    }
  };
  const detailsFor = (path) => {
    const details = artworkDetails[titleFromPath(path)];
    return details && Object.values(details).some((value) => String(value).trim()) ? details : null;
  };
  const detailsDescription = (details, includeSize = true) => [
    details.series && `De la serie ${details.series}`,
    details.author,
    details.technique,
    includeSize && details.size && `Tamaño original: ${details.size}`,
    details.year
  ]
    .filter((value) => value && value.trim())
    .join(' · ');
  const seriesFromPath = (path) => path.includes('obras_subasta') ? 'Obras para la subasta' : formatSeriesLabel(path.split('/')[3].replaceAll('_', ' '));
  const descriptionFor = (path) => {
    const details = detailsFor(path);
    if (details?.description) return details.description;
    if (details) return detailsDescription(details);
    return path.includes('obras_subasta')
      ? 'Obra donada para la Primera Subasta Solidaria de Arte de la Fundación Casa del Pan.'
      : `Obra de la serie ${seriesFromPath(path)} de la colección de la Fundación Casa del Pan.`;
  };
  const imagePath = (folder, file) => `assets/images/COLECCION FCP/${folder}/${file}`;
  const allWorks = galleryRoot.dataset.galleryRoot === 'auction'
    ? auctionWorks.map((path) => ({ path, series: 'Obras para la subasta' }))
    : Object.entries(collectionSeries).flatMap(([series, files]) => files.map((file) => ({ path: imagePath(series, file), series })));

  const galleryStat = document.querySelector('[data-gallery-stat]');
  if (galleryStat) {
    galleryStat.textContent = galleryRoot.dataset.galleryRoot === 'auction'
      ? `${allWorks.length} obras disponibles para conocer`
      : `${allWorks.length} obras · ${Object.keys(collectionSeries).length} series`;
  }

  function card(work, index) {
    const details = detailsFor(work.path);
    const title = details?.title || titleFromPath(work.path);
    const description = descriptionFor(work.path);
    const metadata = details?.description ? detailsDescription(details) : '';
    const figure = document.createElement('figure');
    figure.className = 'art-card';
    const descriptionClass = details?.description ? 'art-description art-description-preview' : 'art-description';
    const metadataMarkup = metadata ? `<p class="art-details">${metadata}</p>` : '';
    figure.innerHTML = `<button type="button" aria-label="Ver ${title} en pantalla completa"><img loading="lazy" src="${work.path}" alt="${title}" data-index="${index}"><figcaption><span class="art-title">${title}</span><span class="art-meta"><span>${formatSeriesLabel(work.series)}</span></span>${metadataMarkup}<p class="${descriptionClass}">${description}</p></figcaption></button>`;
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
    const metadata = details?.description ? detailsDescription(details, false) : '';
    lightboxMeta.textContent = metadata;
    lightboxMeta.hidden = !metadata;
    lightboxDescription.textContent = descriptionFor(work.path);
    lightboxSizeContainer.hidden = false;
    lightboxSize.textContent = details
      ? [details.size, details.year].filter(Boolean).join(' · ')
      : 'Cargando dimensiones...';
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
