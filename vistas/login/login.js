async function login() {
  const url = localStorage.getItem("api");
  var usuario = document.querySelector("#correo").value;
  var clave = document.querySelector("#clave").value;

  var res = await fetch(url + "login", {
    method: "POST",
    body: JSON.stringify({
      email: usuario,
      clave: clave,
    }),
  });

  return res;
}
