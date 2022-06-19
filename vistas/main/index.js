var DEVELOP_API = "http://127.0.0.1:5000/";
var PRODUCTION_API = "https://aydfincas.herokuapp.com/";
API = PRODUCTION_API;
$("#menu-toggle").click(function (e) {
  e.preventDefault();
  $("#wrapper").toggleClass("toggled");
});
