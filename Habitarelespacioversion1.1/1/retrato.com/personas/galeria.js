function obtenerLightbox() {
  var existente = document.querySelector('.detalle-lightbox');
  if (existente) {
    return {
      contenedor: existente,
      imagen: existente.querySelector('.detalle-lightbox-imagen'),
      texto: existente.querySelector('.detalle-lightbox-texto'),
      indice: existente.querySelector('.detalle-lightbox-indice'),
      cerrar: existente.querySelector('.detalle-lightbox-cerrar'),
      anterior: existente.querySelector('.detalle-lightbox-nav--prev'),
      siguiente: existente.querySelector('.detalle-lightbox-nav--next')
    };
  }

  var contenedor = document.createElement('aside');
  contenedor.className = 'detalle-lightbox';
  contenedor.setAttribute('aria-hidden', 'true');
  contenedor.innerHTML =
    '<div class="detalle-lightbox-dialogo" role="dialog" aria-modal="true" aria-label="visor de imagen">' +
      '<button class="detalle-lightbox-cerrar" type="button" aria-label="cerrar imagen ampliada">&times;</button>' +
      '<div class="detalle-lightbox-marco">' +
        '<button class="detalle-lightbox-nav detalle-lightbox-nav--prev" type="button" aria-label="imagen anterior">&#8249;</button>' +
        '<img class="detalle-lightbox-imagen" alt="imagen ampliada">' +
        '<button class="detalle-lightbox-nav detalle-lightbox-nav--next" type="button" aria-label="imagen siguiente">&#8250;</button>' +
      '</div>' +
      '<div class="detalle-lightbox-pie">' +
        '<span class="detalle-lightbox-texto"></span>' +
        '<span class="detalle-lightbox-indice"></span>' +
      '</div>' +
    '</div>';

  document.body.appendChild(contenedor);

  return {
    contenedor: contenedor,
    imagen: contenedor.querySelector('.detalle-lightbox-imagen'),
    texto: contenedor.querySelector('.detalle-lightbox-texto'),
    indice: contenedor.querySelector('.detalle-lightbox-indice'),
    cerrar: contenedor.querySelector('.detalle-lightbox-cerrar'),
    anterior: contenedor.querySelector('.detalle-lightbox-nav--prev'),
    siguiente: contenedor.querySelector('.detalle-lightbox-nav--next')
  };
}

document.querySelectorAll('.detalle-galeria-carrusel').forEach(function (carrusel) {
  var visor = carrusel.querySelector('.detalle-galeria-viewport');
  var pista = carrusel.querySelector('.detalle-galeria-pista');
  var botonAnterior = carrusel.querySelector('.detalle-galeria-flecha--prev');
  var botonSiguiente = carrusel.querySelector('.detalle-galeria-flecha--next');
  var totalGaleria = 6;
  var lightbox = obtenerLightbox();
  var indiceAbierto = -1;

  if (!visor || !pista) {
    return;
  }

  function nombreArchivoDeImagen(item) {
    var imagen = item.querySelector('img');
    if (!imagen) {
      return '';
    }

    var src = imagen.getAttribute('src') || '';
    return src.split('/').pop().toLowerCase();
  }

  function esImagenPrincipalORetrato(item) {
    var nombre = nombreArchivoDeImagen(item);
    return nombre.indexOf('imagen_principal') !== -1 || nombre.indexOf('retrato') !== -1;
  }

  var semillas = Array.from(pista.children).filter(function (item) {
    return !esImagenPrincipalORetrato(item);
  });

  if (semillas.length === 0) {
    return;
  }

  var baseSemillas = semillas.slice();
  var indiceRotacion = 0;

  while (semillas.length < totalGaleria) {
    semillas.push(baseSemillas[indiceRotacion % baseSemillas.length].cloneNode(true));
    indiceRotacion += 1;
  }

  var originales = semillas.slice(0, totalGaleria);
  pista.innerHTML = '';
  var copias = [];

  originales.forEach(function (item, indiceOriginal) {
    item.setAttribute('data-galeria-indice', String(indiceOriginal));
    var copia = item.cloneNode(true);
    copia.setAttribute('data-galeria-indice', String(indiceOriginal));

    pista.appendChild(item);
    copias.push(copia);
  });

  copias.forEach(function (copia) {
    pista.appendChild(copia);
  });

  var indice = 0;
  var intervalo = null;

  function obtenerColumnasVisibles() {
    return window.innerWidth <= 560 ? 1 : window.innerWidth <= 760 ? 2 : 3;
  }

  function obtenerPaso() {
    var primerElemento = pista.querySelector('.detalle-galeria-item');
    if (!primerElemento) {
      return 0;
    }

    var estilos = window.getComputedStyle(pista);
    var espacio = parseFloat(estilos.columnGap || estilos.gap || '0');
    return primerElemento.getBoundingClientRect().width + espacio;
  }

  function aplicarTransicionDesplazamiento() {
    pista.classList.add('animando');
    pista.style.transform = 'translateX(' + (-indice * obtenerPaso()) + 'px)';
  }

  function avanzar() {
    indice += 1;
    aplicarTransicionDesplazamiento();
  }

  function retroceder() {
    if (indice === 0) {
      pista.classList.remove('animando');
      indice = originales.length;
      pista.style.transform = 'translateX(' + (-indice * obtenerPaso()) + 'px)';
      pista.offsetHeight;
    }

    indice -= 1;
    aplicarTransicionDesplazamiento();
  }

  function reiniciarCarruselSiHaceFalta() {
    if (indice >= originales.length) {
      pista.classList.remove('animando');
      indice = 0;
      pista.style.transform = 'translateX(0)';
    }
  }

  function arrancar() {
    detener();
    intervalo = window.setInterval(avanzar, 2600);
  }

  function detener() {
    if (intervalo) {
      window.clearInterval(intervalo);
      intervalo = null;
    }
  }

  function mostrarEnLightbox(indiceReal) {
    if (indiceReal < 0 || indiceReal >= originales.length) {
      return;
    }

    var figura = originales[indiceReal];
    var imagen = figura.querySelector('img');
    if (!imagen) {
      return;
    }

    indiceAbierto = indiceReal;
    lightbox.imagen.src = imagen.getAttribute('src') || '';
    lightbox.imagen.alt = imagen.alt || 'imagen ampliada';
    lightbox.texto.textContent = 'descripcion galeria ' + (indiceReal + 1);
    lightbox.indice.textContent = (indiceReal + 1) + ' / ' + originales.length;
    lightbox.contenedor.classList.add('activo');
    lightbox.contenedor.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    detener();
  }

  function cerrarLightbox() {
    lightbox.contenedor.classList.remove('activo');
    lightbox.contenedor.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    indiceAbierto = -1;
    arrancar();
  }

  function cambiarImagenLightbox(direccion) {
    if (indiceAbierto < 0) {
      return;
    }

    indiceAbierto = (indiceAbierto + direccion + originales.length) % originales.length;
    mostrarEnLightbox(indiceAbierto);
  }

  pista.addEventListener('transitionend', reiniciarCarruselSiHaceFalta);

  pista.addEventListener('click', function (evento) {
    var item = evento.target.closest('.detalle-galeria-item');
    if (!item) {
      return;
    }

    var indiceGuardado = Number(item.getAttribute('data-galeria-indice'));
    if (Number.isNaN(indiceGuardado)) {
      var itemsRenderizados = Array.from(pista.children);
      var indiceRender = itemsRenderizados.indexOf(item);
      if (indiceRender < 0) {
        return;
      }
      mostrarEnLightbox(indiceRender % originales.length);
      return;
    }

    mostrarEnLightbox(indiceGuardado);
  });

  if (botonSiguiente) {
    botonSiguiente.addEventListener('click', function () {
      detener();
      avanzar();
      arrancar();
    });
  }

  if (botonAnterior) {
    botonAnterior.addEventListener('click', function () {
      detener();
      retroceder();
      arrancar();
    });
  }

  carrusel.addEventListener('mouseenter', detener);
  carrusel.addEventListener('mouseleave', arrancar);
  carrusel.addEventListener('focusin', detener);
  carrusel.addEventListener('focusout', arrancar);

  lightbox.cerrar.addEventListener('click', cerrarLightbox);
  lightbox.anterior.addEventListener('click', function () {
    cambiarImagenLightbox(-1);
  });
  lightbox.siguiente.addEventListener('click', function () {
    cambiarImagenLightbox(1);
  });

  lightbox.contenedor.addEventListener('click', function (evento) {
    if (evento.target === lightbox.contenedor) {
      cerrarLightbox();
    }
  });

  document.addEventListener('keydown', function (evento) {
    if (!lightbox.contenedor.classList.contains('activo')) {
      return;
    }

    if (evento.key === 'Escape') {
      cerrarLightbox();
    } else if (evento.key === 'ArrowRight') {
      cambiarImagenLightbox(1);
    } else if (evento.key === 'ArrowLeft') {
      cambiarImagenLightbox(-1);
    }
  });

  window.addEventListener('resize', function () {
    pista.classList.remove('animando');
    indice = Math.min(indice, originales.length - 1);
    pista.style.transform = 'translateX(' + (-indice * obtenerPaso()) + 'px)';
    pista.style.setProperty('--columnas', obtenerColumnasVisibles());
  });

  pista.style.setProperty('--columnas', obtenerColumnasVisibles());
  pista.style.transform = 'translateX(0)';
  arrancar();
});
