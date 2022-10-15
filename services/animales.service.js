async function obtenerAnimales() {
  let data = await fetch(API + 'animales', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(res => res.json());
  if (data) {
    localStorage.setItem('animales', JSON.stringify(data));
    return data;
  }
}
