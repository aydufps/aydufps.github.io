const API = "https://aydfincas.herokuapp.com/";
var headers = new Headers();

async function post(url, data) {
  return fetch(API + url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
    //mode: "no-cors",
  }); //.then((res) => {
  //console.log(res);
  /** res.json() */
  //});
  // .catch((error) => console.error("Error:", error));
  // .then((response) => console.log("Success:", response));
}
