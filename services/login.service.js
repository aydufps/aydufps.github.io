async function login() {
  let data = {
    email: document.querySelector("#correo").value,
    clave: document.querySelector("#clave").value,
  };
  let { ok } = await post("login", data);
  if (ok) {
    window.location.replace("../../index.html");
  }
}

document.querySelector("#btn-submit").addEventListener("click", login);
