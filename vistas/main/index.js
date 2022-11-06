var DEVELOP_API = "http://127.0.0.1:5000/";
var PRODUCTION_API =
  "https://flask-service.4csvpc17p5v1q.us-east-1.cs.amazonlightsail.com/";
API = PRODUCTION_API;
$("#menu-toggle").click(function (e) {
  e.preventDefault();
  $("#wrapper").toggleClass("toggled");
});

function iniciar() {
  localStorage.setItem(
    "api",
    "https://flask-service.4csvpc17p5v1q.us-east-1.cs.amazonlightsail.com/"
  );
}
iniciar();
