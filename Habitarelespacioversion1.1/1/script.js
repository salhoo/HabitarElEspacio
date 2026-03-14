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

function activarPieza() {
  var img = this.querySelector('img');
  var nombre = imagenAleatoria();
  var lugar = this.getAttribute('data-pieza') || 'pieza-sin-nombre';

  img.src = 'assets/' + nombre + '.jpg';
  img.alt = nombre + ' en ' + lugar;
  img.dataset.imagen = nombre.replace('imagen-', 'IMG-');
  this.classList.add('activa');
}

for (var i = 0; i < piezas.length; i += 1) {
  piezas[i].querySelector('img').removeAttribute('src');
  piezas[i].addEventListener('mouseenter', activarPieza);
}
