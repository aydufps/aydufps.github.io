API = "https://aydfincas.herokuapp.com/";
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

async function deleted(url,id) {
  return fetch(API + url + "/" + id, {
    method: "DELETE",
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

async function put(url, data) {
  return fetch(API + url, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
}

