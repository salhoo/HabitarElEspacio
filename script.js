var imagenes = [
  'imagen-01',
  'imagen-02',
  'imagen-03',
  'imagen-04',
  'imagen-05',
  'imagen-06',
  'imagen-07',
  'imagen-08'
];
var piezas = document.querySelectorAll('.pieza');

function imagenAleatoria() {
  return imagenes[Math.floor(Math.random() * imagenes.length)];
}

function establecerImagen(pieza) {
  var img = pieza.querySelector('img');
  var nombre = imagenAleatoria();
  var lugar = pieza.getAttribute('data-pieza') || 'pieza-sin-nombre';

  img.src = 'assets/' + nombre + '.jpg';
  img.alt = nombre + ' en ' + lugar;
  img.dataset.imagen = nombre.replace('imagen-', 'IMG-');
  pieza.classList.add('activa');
}

function activarPieza() {
  establecerImagen(this);
}

if (window.matchMedia('(hover: none), (pointer: coarse)').matches) {
  // Dispositivo táctil (móviles/tablets)
  for (var i = 0; i < piezas.length; i += 1) {
    piezas[i].querySelector('img').removeAttribute('src');
    piezas[i].addEventListener('click', activarPieza);
    piezas[i].addEventListener('focusin', activarPieza);
    establecerImagen(piezas[i]);
  }
} else {
  // Dispositivo con hover (laptops/escritorios)
  for (var i = 0; i < piezas.length; i += 1) {
    piezas[i].querySelector('img').removeAttribute('src');
    piezas[i].addEventListener('mouseenter', activarPieza);
    piezas[i].addEventListener('focusin', activarPieza);
  }
}
