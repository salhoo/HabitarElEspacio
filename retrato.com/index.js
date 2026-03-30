var escenas = [
  document.getElementById('escena-1'),
  document.getElementById('escena-2')
];

function actualizarEscena() {
  // optimización de dispositivos móviles y pantallas pequeñas
  if (window.innerWidth <= 560) {
    return;
  }

  var activa = window.scrollY >= window.innerHeight * 0.55 ? 1 : 0;

  for (var i = 0; i < escenas.length; i += 1) {
    if (!escenas[i]) {
      continue;
    }

    escenas[i].classList.toggle('activa', i === activa);
  }
}

window.addEventListener('scroll', actualizarEscena);
window.addEventListener('resize', actualizarEscena);
actualizarEscena();
