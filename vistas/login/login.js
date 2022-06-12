async function login() {
  alert("ss");
  var usuario = document.querySelector("#correo").value;
  var clave = document.querySelector("#clave").value;

  var res = await fetch("https://aydfincas.herokuapp.com/login", {
    method: "POST",
    body: JSON.stringify({
      email: usuario,
      clave: clave,
    }),
  });

  return console.log(res);
}

//document.getElementById("btn-submit").addEventListener("click", login, true);
