var imagenes = [
  { id: 'IMG-01', nombre: 'imagen-01', src: 'assets/imagen-01.jpg' },
  { id: 'IMG-02', nombre: 'imagen-02', src: 'assets/imagen-02.jpg' },
  { id: 'IMG-03', nombre: 'imagen-03', src: 'assets/imagen-03.jpg' },
  { id: 'IMG-04', nombre: 'imagen-04', src: 'assets/imagen-04.jpg' },
  { id: 'IMG-05', nombre: 'imagen-05', src: 'assets/imagen-05.jpg' },
  { id: 'IMG-06', nombre: 'imagen-06', src: 'assets/imagen-06.jpg' },
  { id: 'IMG-07', nombre: 'imagen-07', src: 'assets/imagen-07.jpg' },
  { id: 'IMG-08', nombre: 'imagen-08', src: 'assets/imagen-08.jpg' }
];

var cuadros = document.querySelectorAll('.pieza');

function numeroAleatorio(maximo) {
  return Math.floor(Math.random() * maximo);
}

for (var i = 0; i < cuadros.length; i++) {
  var img = cuadros[i].querySelector('img');
  img.removeAttribute('src');

  cuadros[i].addEventListener('mouseenter', function () {
    var imagen = this.querySelector('img');
    var posicion = numeroAleatorio(imagenes.length);
    var seleccion = imagenes[posicion];
    var nombrePieza = this.getAttribute('data-pieza') || 'pieza-sin-nombre';

    imagen.src = seleccion.src;
    imagen.alt = seleccion.nombre + ' en ' + nombrePieza;
    imagen.setAttribute('data-imagen', seleccion.id);

    this.classList.add('activa');
  });
}
