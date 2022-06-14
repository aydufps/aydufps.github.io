//const API = "http://127.0.0.1:5000/";
var headers = new Headers();

async function get(url) {
  console.log(API + url);
  return fetch(API + url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
}

async function post(url, data) {
  return fetch(API + url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
}
