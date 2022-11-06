async function login() {
  var usuario = document.querySelector("#correo").value;
  var clave = document.querySelector("#clave").value;

  var res = await fetch(
    "https://flask-service.4csvpc17p5v1q.us-east-1.cs.amazonlightsail.com/login",
    {
      method: "POST",
      body: JSON.stringify({
        email: usuario,
        clave: clave,
      }),
    }
  );

  return res;
}
