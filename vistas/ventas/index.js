const componentanimal = 'animales';
console.log("ijijijijij");
const animalesVenta = "";

async function obtenerAnimalesVenta(){
  const url = localStorage.getItem("api");
    let data = await fetch(url + "animales-en-venta", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
      if (data) {
        localStorage.setItem('animalesventa', JSON.stringify(data));
        return data;
      }
}

async function agregarFotoAlModal(id, id_imagen) {
  const storageRef = firebase.storage().ref();
  storageRef
    .child(`animales/${id}/profile.jpg`)
    .getDownloadURL()
    .then(url => {
      document.querySelector(`#${id_imagen}`).setAttribute('src', url);
    })
    .catch(error => { });
}

window.onload = async function () {
  await obtenerAnimalesVenta();
  await crearCatalogo();
}

async function crearCatalogo(){
    const animalesVenta = await obtenerAnimalesVenta();
    console.log(animalesVenta);
    let filas = animalesVenta.map(
        (u, i) => ` <div class="col-sm-4">
                      <div class="card">
                          <img class="card-img-top" src="" id="imagenventa-${u.id}">
                        <div class="card-body">
                            <h5 class="card-title" id="nombre-animal-venta">${u.nombre}</h3>
                            <p class="card-text" id="deatalle-animal-venta">${u.detalles}</p>
                          <div class="form-group">
                            <label for="formGroupExampleInput"><strong>Fecha de Nacimiento:</strong></label>
                            <label class="" id="fechaNacimineto-animal-venta">${u.fecha_nacimiento}</label>
                          </div><br>
                            <label for="formGroupExampleInput"><strong>Precio:</strong></label>
                            <h6 id="precio-animal-venta">${u.precio || "N/A"}</h6>  
                        </div>
                      </div>
                    </div>`
      );
    console.log(filas);
    var contenedorAnimal = `
                              ${filas.join("")}
    `
    document.querySelector("#catalogo-venta").innerHTML = contenedorAnimal;

    for (const animal in animalesVenta) {
      agregarFotoAlModal(animalesVenta[animal].id , `imagenventa-${animalesVenta[animal].id}` );
    }
}

function iniciar() {
  localStorage.setItem(
    "api",
    "https://flask-service.4csvpc17p5v1q.us-east-1.cs.amazonlightsail.com/"
  );
}
iniciar();




