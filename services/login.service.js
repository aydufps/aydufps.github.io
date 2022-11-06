async function login() {
  let data = {
    email: document.querySelector("#correo").value,
    clave: document.querySelector("#clave").value,
  };
  let usuario = await post("login", data);
  
  if (usuario) {
    localStorage.setItem("usuario", JSON.stringify(usuario));
    window.location.replace("../../index.html");
  }else {
    alert("El usuario no se encuentra registrado")
  }
}

document.querySelector("#btn-submit").addEventListener("click", login);

function iniciar() {
  localStorage.setItem(
    "api",
    "https://flask-service.4csvpc17p5v1q.us-east-1.cs.amazonlightsail.com/"
  );
}
iniciar();
