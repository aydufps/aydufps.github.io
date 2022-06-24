async function login() {
  let data = {
    email: document.querySelector("#correo").value,
    clave: document.querySelector("#clave").value,
  };
  let usuario = await post("login", data);
  if (usuario) {
    localStorage.setItem("usuario", JSON.stringify(usuario));
    window.location.replace("../../index.html");
  }else{
    alert("No se encuentra registardo");
  }
}

document.querySelector("#btn-submit").addEventListener("click", login);
