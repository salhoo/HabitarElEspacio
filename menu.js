var botonesVolver = document.querySelectorAll('.volver');

for (var i = 0; i < botonesVolver.length; i += 1) {
  botonesVolver[i].addEventListener('click', function (event) {
    if (window.history.length < 2) {
      return;
    }

    event.preventDefault();
    window.history.back();
  });
}
