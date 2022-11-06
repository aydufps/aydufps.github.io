async function tomarCorreo() {
  const url = localStorage.getItem("api");
  let data = {
    correo: document.querySelector("#cambio-clave-correo").value,
  };
  const respuesta = await fetch(url + "mail", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
  let string = "<div class='alert alert-info' role='alert'>";
  string += respuesta;
  string += "</div>";

  document.getElementById("respuesta-dinamica").innerHTML = string;
}

window.onload = async function () {
  var correo = document.getElementById("cambio-clave-correo");

  document
    .querySelector("#Enviar-clave")
    .addEventListener("click", tomarCorreo);
};
