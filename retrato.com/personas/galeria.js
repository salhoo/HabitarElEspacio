var formas = ['forma-a', 'forma-b', 'forma-c', 'forma-d', 'forma-e', 'forma-f'];
var galerias = document.querySelectorAll('.detalle-galeria');
var visor = crearVisor();
var visorEstado = {
  abierto: false,
  indice: 0,
  items: [],
  disparador: null,
  cierre: null
};

function textoPlano(texto) {
  return (texto || '').replace(/\s+/g, ' ').trim();
}

function obtenerNombre(seccion) {
  var detalle = seccion.closest('.detalle');
  var titulo = detalle ? detalle.querySelector('.detalle-nombre') : null;
  return textoPlano(titulo ? titulo.textContent : '') || 'Retrato';
}

function limpiarItem(item) {
  formas.forEach(function (clase) {
    item.classList.remove(clase);
  });
  item.style.removeProperty('grid-column');
  item.style.removeProperty('grid-row');
}

function crearVisor() {
  var root = document.getElementById('detalle-lightbox');

  if (!root) {
    root = document.createElement('div');
    root.id = 'detalle-lightbox';
    root.className = 'detalle-lightbox';
    root.hidden = true;
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-label', 'Visor de galeria');
    root.innerHTML = [
      '<button type="button" class="detalle-lightbox__backdrop" aria-label="Cerrar visor"></button>',
      '<div class="detalle-lightbox__dialog">',
      '  <button type="button" class="detalle-lightbox__close" aria-label="Cerrar visor">&times;</button>',
      '  <div class="detalle-lightbox__frame">',
      '    <img class="detalle-lightbox__image" alt="">',
      '  </div>',
      '  <div class="detalle-lightbox__meta">',
      '    <p class="detalle-lightbox__caption"></p>',
      '    <p class="detalle-lightbox__counter"></p>',
      '  </div>',
      '</div>'
    ].join('');
    document.body.appendChild(root);
  }

  var close = root.querySelector('.detalle-lightbox__close');

  root.querySelector('.detalle-lightbox__backdrop').addEventListener('click', cerrarVisor);
  close.addEventListener('click', cerrarVisor);

  return {
    root: root,
    image: root.querySelector('.detalle-lightbox__image'),
    caption: root.querySelector('.detalle-lightbox__caption'),
    counter: root.querySelector('.detalle-lightbox__counter'),
    close: close
  };
}

function actualizarVisor() {
  var item = visorEstado.items[visorEstado.indice];
  var imagen = item ? item.querySelector('img') : null;
  var titulo = item ? item.dataset.coleccionTitulo : '';

  if (!imagen) {
    return;
  }

  visor.image.src = imagen.currentSrc || imagen.getAttribute('src') || '';
  visor.image.alt = titulo;
  visor.caption.textContent = titulo;
  visor.counter.textContent = (visorEstado.indice + 1) + ' / ' + visorEstado.items.length;
}

function abrirVisor(items, indice, disparador) {
  if (visorEstado.cierre) {
    window.clearTimeout(visorEstado.cierre);
    visorEstado.cierre = null;
  }

  visorEstado.abierto = true;
  visorEstado.items = items;
  visorEstado.indice = indice;
  visorEstado.disparador = disparador;

  actualizarVisor();
  visor.root.hidden = false;
  document.body.classList.add('detalle-lightbox-abierto');

  requestAnimationFrame(function () {
    visor.root.classList.add('activa');
    visor.close.focus();
  });
}

function cerrarVisor() {
  if (!visorEstado.abierto) {
    return;
  }

  visorEstado.abierto = false;
  visor.root.classList.remove('activa');
  document.body.classList.remove('detalle-lightbox-abierto');

  visorEstado.cierre = window.setTimeout(function () {
    visor.root.hidden = true;
    visor.image.removeAttribute('src');
    visorEstado.cierre = null;
  }, 180);

  if (visorEstado.disparador) {
    visorEstado.disparador.focus();
  }
}

function moverVisor(paso) {
  if (!visorEstado.abierto || !visorEstado.items.length) {
    return;
  }

  visorEstado.indice = (visorEstado.indice + paso + visorEstado.items.length) % visorEstado.items.length;
  actualizarVisor();
}

function prepararGaleria(seccion) {
  var pista = seccion.querySelector('.detalle-galeria-pista');
  var base = pista ? Array.from(pista.querySelectorAll('.detalle-galeria-item')) : [];
  var nombre = obtenerNombre(seccion);
  var items = [];

  if (!pista || !base.length) {
    return;
  }

  pista.innerHTML = '';

  formas.forEach(function (clase, indice) {
    var item = base[indice % base.length].cloneNode(true);
    var titulo = 'Coleccion ' + (indice + 1) + '. ' + nombre;

    limpiarItem(item);
    item.classList.add(clase);
    item.style.setProperty('--item-delay', ((formas.length - 1 - indice) * 0.06) + 's');
    item.dataset.coleccionTitulo = titulo;
    item.tabIndex = 0;
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', 'Abrir ' + titulo);

    item.addEventListener('click', function () {
      abrirVisor(items, indice, item);
    });

    item.addEventListener('keydown', function (event) {
      if (event.key !== 'Enter' && event.key !== ' ') {
        return;
      }

      event.preventDefault();
      abrirVisor(items, indice, item);
    });

    pista.appendChild(item);
    items.push(item);
  });
}

var observador = new IntersectionObserver(function (entradas, obs) {
  entradas.forEach(function (entrada) {
    if (!entrada.isIntersecting) {
      return;
    }

    entrada.target.classList.add('activa');
    obs.unobserve(entrada.target);
  });
}, {
  threshold: 0.05,
  rootMargin: '0px 0px 10% 0px'
});

galerias.forEach(function (seccion) {
  prepararGaleria(seccion);
  observador.observe(seccion);
});

document.addEventListener('keydown', function (event) {
  if (!visorEstado.abierto) {
    return;
  }

  if (event.key === 'Escape') {
    event.preventDefault();
    cerrarVisor();
  }

  if (event.key === 'ArrowRight') {
    event.preventDefault();
    moverVisor(1);
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    moverVisor(-1);
  }
});
