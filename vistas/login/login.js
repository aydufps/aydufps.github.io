async function login() {
  var usuario = document.querySelector("#correo").value;
  var clave = document.querySelector("#clave").value;

  var res = await fetch("https://aydfincas.herokuapp.com/login", {
    method: "POST",
    body: JSON.stringify({
      email: usuario,
      clave: clave,
    }),
  });

  return res;
}
