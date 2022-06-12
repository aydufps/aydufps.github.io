function cerrarSesion() {
  window.location.replace("/vistas/login/login.html");
}

document
  .querySelector("#btnCerrarSesion")
  .addEventListener("click", cerrarSesion);
