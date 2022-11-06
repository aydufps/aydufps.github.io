async function registrarClave() {
  const url = localStorage.getItem("api");
  var clave = document.querySelector("#nueva-clave").value;
  var conClave = document.querySelector("#confirmar-nueva-clave").value;
  if (clave != "" && clave != " " && clave != "  ") {
    if (clave == conClave) {
      var valor_id = window.location.search;
      const urlParams = new URLSearchParams(valor_id);
      var idUsuario = urlParams.get("id");
      alert(idUsuario);
      let data = {
        clave: conClave,
        id: idUsuario,
      };
      const respuesta = await fetch(url + "nueva_clave", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
      let string = "<div class='alert alert-info' role='alert'>";
      string += respuesta;
      string += "<a href='/vistas/login/login.html'> Iniciar Sesion</a>";
      string += "</div>";

      document.getElementById("respuesta-dinamica").innerHTML = string;
    } else {
      alert("Verifica las claves no coinciden ");
    }
  } else {
    alert("Por favor digita tu clave");
  }
}

document
  .querySelector("#registrar-clave")
  .addEventListener("click", registrarClave);

function iniciar() {
  localStorage.setItem(
    "api",
    "https://flask-service.4csvpc17p5v1q.us-east-1.cs.amazonlightsail.com/"
  );
}
iniciar();
