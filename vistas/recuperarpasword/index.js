async function tomarCorreo() {
  let data = {
    correo: document.querySelector("#cambio-clave-correo").value,
  };
  const respuesta = await fetch(
    "https://flask-service.4csvpc17p5v1q.us-east-1.cs.amazonlightsail.com/mail",
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).then((res) => res.json());
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
