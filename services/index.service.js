const componentanimal = "animales";

function cerrarSesion() {
  window.location.replace("/vistas/login/login.html");
}

async function cargarDatosDeUsuario() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  switch (usuario.rol_id) {
    case ROLES.ADMINISTRADOR:
      document.querySelector("#rolLabel").textContent = "ADMINISTRADOR";
      document.getElementById("btnEnfermedades").style.display = "none";
      document.getElementById("btnVacunas").style.display = "none";
      break;
    case ROLES.CAPATAZ:
      document.querySelector("#rolLabel").textContent = "VETERINARIO";
      document.getElementById("btnCargarInsumos").style.display = "none";
      document.getElementById("btnCargarUsuarios").style.display = "none";
      break;
    case ROLES.VETERINARIO:
      document.querySelector("#rolLabel").textContent = "CAPATAZ";
      document.getElementById("btnCargarUsuarios").style.display = "none";
      document.getElementById("btnEnfermedades").style.display = "none";
      document.getElementById("btnVacunas").style.display = "none";
      break;
    default:
      break;
  }
}

async function existeUnLogueado() {
  try {
    const usuario = localStorage.getItem("usuario");
    console.log(usuario);
    if (!usuario) {
      window.location.replace("/vistas/login/login.html");
    }
  } catch (error) {
    console.log(error);
  }
}

async function addView(html) {
  document.querySelector("#contenido-dinamico").innerHTML = html;
}

async function iniciarPagina() {
  await cargarDatosDeUsuario();
}

async function agregarAnimalSelect() {
  var selectmadre = document.getElementById("select-madre");
  var selectpadre = document.getElementById("select-padre");
  const animales = await obtenerAnimales();
  if (selectmadre.length == 1) {
    for (let index = 0; index < animales.length; index++) {
      if (animales[index].genero == false) {
        const optionmadre = document.createElement("option");
        optionmadre.value = animales[index].id;
        optionmadre.text = animales[index].nombre;
        selectmadre.appendChild(optionmadre);
      } else {
        const optionpadre = document.createElement("option");
        optionpadre.value = animales[index].id;
        optionpadre.text = animales[index].nombre;
        selectpadre.appendChild(optionpadre);
      }
    }
  }
}

async function guardarAnimal() {
  const url = localStorage.getItem("api");
  let data = {
    nombre: document.querySelector("#nombre-animal").value,
    genero: document.querySelector("#genero-animal").value == "true",
    detalles: document.querySelector("#detalles-animal").value,
    padre_id: document.querySelector("#select-padre").value || null,
    madre_id: document.querySelector("#select-madre").value || null,
    fecha_nacimiento: document.getElementById("fecha-nacimiento-animal").value,
  };
  let animal = await fetch(url + "animales", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());

  const imput = document.querySelector("#fileUpload");
  const file = imput.files[0];
  // const file = JSON.parse(localStorage.getItem("imagen"));
  if (file) {
    if (file.type === "image/jpg" || file.type === "image/jpeg") {
      const path = "animales/" + animal.id + "/profile.jpg";
      let storageRef = firebase.storage().ref();
      let fotoRef = storageRef.child(path);
      Swal.showLoading();
      fotoRef
        .putString(await toBase64(file), "data_url")
        .then(async function () {
          await agregarFotoAlModal();
          Swal.fire({
            icon: "success",
            title: "Listo",
            text: "Foto actualizada",
          });
        });
    } else {
      console.log(
        "Error",
        "Solo se pueden cargar imagenes con formato jpg o jpge"
      );
      Swal.fire({
        icon: "error",
        title: "Advertencia",
        text: "Solo se pueden cargar imagenes con formato jpg o jpge",
      });
    }
  }
  cargarVistaGestionAnimal();
}

async function guardaridAnimal(idAnimal) {
  localStorage.setItem("idEliminar", idAnimal);
}

async function guardaridAnimalVenta(idAnimal) {
  const url = localStorage.getItem("api");
  localStorage.setItem("idEliminar", idAnimal);
  let data = localStorage.getItem("animales");
  if (!data) return;
  data = JSON.parse(data);
  const item = data.find((el) => el.id == idAnimal);
  if (!item) return;
  console.log(item);
  document.querySelector("#detalle-venta").textContent = item.enVenta
    ? "Deseas cancelar la venta"
    : "¿Desea colocar en venta el animal?";
}

async function eliminarAnimal() {
  const url = localStorage.getItem("api");
  const id = localStorage.getItem("idEliminar");
  console.log(id);
  fetch(url + "animal/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    cargarVistaGestionAnimal();
    localStorage.removeItem("idEliminar");
  });
}

async function borraridAnimal() {
  localStorage.removeItem("idEliminar");
}

async function agregarSelectVacuna() {
  var selectVacunaAnimal = document.getElementById("selected-vacuna");
  const vacunas = await obtenerVacunas();
  if (selectVacunaAnimal.length == 1) {
    for (let index = 0; index < vacunas.length; index++) {
      if (vacunas[index].unidades > 0) {
        const optionVacuna = document.createElement("option");
        optionVacuna.value = vacunas[index].id;
        optionVacuna.text = vacunas[index].nombre;
        selectVacunaAnimal.appendChild(optionVacuna);
      }
    }
  }
}

async function guardarVacunaAnimal() {
  const url = localStorage.getItem("api");
  var validarVacuna = false;
  id_vacuna = document.querySelector("#selected-vacuna").value;
  id_animal = localStorage.getItem("idEliminar");
  console.log(id_vacuna, id_animal);
  const animales = await obtenerAnimales();
  console.log(animales.id);

  for (let index = 0; index < animales.length; index++) {
    if (animales[index].id == id_animal) {
      const vacunasAnimal = animales[index].vacunas;
      for (let inicio = 0; inicio < vacunasAnimal.length; inicio++) {
        if (vacunasAnimal[inicio].vacuna_id == id_vacuna) {
          console.log("El animal ya tiene esta vacuna");
          validarVacuna = true;
        }
      }
      
    }
  }
  console.log(validarVacuna);
  if(validarVacuna == false) {
     let data = {
       animal_id: localStorage.getItem("idEliminar"),
       vacuna_id: document.querySelector("#selected-vacuna").value,
     };
     fetch(url + "animales/vacunas", {
       method: "POST",
       body: JSON.stringify(data),
       headers: {
         "Content-Type": "application/json",
       },
     }).then((res) => res.json());
     const vacunas = await obtenerVacunas();
     for (let index = 0; index < vacunas.length; index++) {
       if (id_vacuna == vacunas[index].id) {
         let data = {
           id: vacunas[index].id,
           nombre: vacunas[index].nombre,
           detalles: vacunas[index].detalles,
           estado: vacunas[index].estado,
           unidades: vacunas[index].unidades - 1,
           fecha_vencimiento_lote: vacunas[index].fecha_vencimiento_lote,
         };
         fetch(url + "vacunas", {
           method: "PUT",
           body: JSON.stringify(data),
           headers: {
             "Content-Type": "application/json",
           },
         }).then((res) => res.json());
       }
     }
     cargarVistaGestionAnimal();
  }
}

async function cargaContenidoAnimal() {
  try {
    const url = `/vistas/${componentanimal}/index.html`;
    const html = await fetch(url).then((r) => r.text());
    const urlEncabezado = `/vistas/${componentanimal}/encabezado.html`;
    const htmlEncabezado = await fetch(urlEncabezado).then((r) => r.text());

    document.querySelector("#contenido-dinamico").innerHTML = html;
    document.querySelector("#encabezado-dinamico").innerHTML = htmlEncabezado;
    document
      .querySelector("#btnAnimales")
      .addEventListener("click", cargarVistaGestionAnimal);

    document
      .querySelector("#guardar-animal")
      .addEventListener("click", guardarAnimal);
    document
      .querySelector("#no-eliminar-animal")
      .addEventListener("click", borraridAnimal);
    document
      .querySelector("#si-eliminar-animal")
      .addEventListener("click", eliminarAnimal);
    document
      .querySelector("#guardar-vacuna-animal")
      .addEventListener("click", guardarVacunaAnimal);

    document
      .querySelector("#si-colocar-venta-animal")
      .addEventListener("click", colocarVentaAnimal);
  } catch (error) {
    console.log(error);
    alert("no entra al sistema de encabesado");
    alert("dekmdkemdkm");
  }
  agregarAnimalSelect();
  agregarSelectVacuna();
}

async function cargarVistaGestionAnimal() {
  cargaContenidoAnimal();
  try {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const url = "/vistas/animales/index.html";
    const html = await fetch(url).then((r) => r.text());
    const animales = await obtenerAnimales();
    const nombrevacuna = {};
    /* for (let index = 0; index < animales.length; index++) {
      console.log(animales[index].vacunas);
    } */
    //console.log(animales);
    let filas = animales.map(
      (u, i) => `<tr>
                    <td>${u.nombre}</td>
                    <td style="max-width: 200px; overflow: auto; margin: 0px">${
                      u.detalles
                    }</td>
                    <td>${u.fecha_nacimiento}</td>
                    <td>${u.genero ? "Macho" : "Hembra"}</td>
                    <td>${
                      u.madre_id == null
                        ? "N/A"
                        : `<a class="float-right mr-3" data-toggle="modal" href="#animal-modal-detail" id="boton-detalles-madre"><button class="float-right btn btn-outline-primary btn-sm" id="boton-agregar-vacuna" onclick="guardarIdAnimal(${u.madre_id})" >Ver Madre</button></a>`
                    }
                    </td>
                    <td>${
                      u.padre_id == null
                        ? "N/A"
                        : `<a class="float-right mr-3" data-toggle="modal" href="#animal-modal-detail" id="buton-vacuna"><button class="float-right btn btn-outline-primary btn-sm" id="boton-agregar-vacuna" onclick="guardarIdAnimal(${u.padre_id})">Ver Padre</button></a`
                    }
                    </td>
                    <td>${u.estado ? "Activa" : "Inactiva"}</td>
                    <td style="margin:center;">
                        <a class="float-right mr-3" data-toggle="modal" href="#ventana3" id="buton-vacuna">
                          <button class="float-right btn btn-primary btn-sm" id="boton-agregar-vacuna" onclick="guardaridAnimal(${
                            u.id
                          })">
                          <i class="fas fa-syringe"></i>
                          </button>
                        </a>
                        <a class="float-right mr-3" data-toggle="modal" href="#animal-modal-detail" id="buton-vacuna">
                          <button class="float-right btn btn-primary btn-sm" id="boton-agregar-vacuna" onclick="guardarIdAnimal(${
                            u.id
                          })">
                          <i class="fas fa-eye"></i>
                          </button>
                        </a>
                        <a class="float-right mr-3" data-toggle="modal" href="#ventana2" id="buton-eliminar">
                          <button class="float-right btn btn-danger btn-sm" id="boton-eliminar-animal" onclick="guardaridAnimal(${
                            u.id
                          })">
                            <i class="fas fa-trash-alt"></i>
                          </button>
                        </a>
                        ${
                          usuario.rol_id == 1
                            ? `<a class="float-right mr-3" data-toggle="modal" href="#venta-modal-animal" id="buton-eliminar">
                        <button class="float-right btn btn-${
                          u.enVenta ? "danger" : "success"
                        } btn-sm" id="boton-eliminar-animal" onclick="guardaridAnimalVenta(${
                                u.id
                              })">
                           ${
                             u.enVenta ? "Cancelar Venta" : "Colocar Venta"
                           } <i class="fas fa-dollar-sign"></i>
                        </button>
                        </a>`
                            : ""
                        } 
                    </td>
                  </tr>
                  `
    );
    document.querySelector("#contenido-dinamico").innerHTML = html;
    document.querySelector("#animales-body").innerHTML = filas;
    new JSTable("#animals-table", {
      sortable: true,
      searchable: true,
      labels: {
        placeholder: "Buscar...",
        perPage: "{select} Entradas por pagina",
        perPageSelect: [5, 10, 15, 20, 25],
        noRows: "No hay entradas",
        info: "Mostrando {start} / {end} de {rows} entradas",
        loading: "Loading...",
        infoFiltered:
          "Mostrando {start} / {end} de {rows} entradas (filtrado de {rowsTotal} entradas)",
      },
      columns: [
        {
          select: 0,
          sortable: true,
          sort: "asc",
          searchable: true,
          render: function (cell, idx) {
            let data = cell.innerHTML;
            return data;
          },
        },
      ],
    });
  } catch (error) {
    console.log(error);
  }
}

window.onload = async function () {
  const animales = await obtenerAnimales();
  const vacunas = await obtenerVacunas();
  const insumos = await obtenerInsumos();
  const enfermedades = await obtenerEnfermedades();
  const usuario = await obtenerUsuarios();
  var cantidadVacunas = 0;
  console.log(cantidadVacunas);
  for (let index = 0; index < vacunas.length; index++) {
    cantidadVacunas += parseInt(vacunas[index].unidades);
  }

  await existeUnLogueado();
  await iniciarPagina();
  document
    .querySelector("#btnCargarAnimal")
    .addEventListener("click", cargarVistaGestionAnimal);
  document
    .querySelector("#btnCargarInsumos")
    .addEventListener("click", cargarVistaGestionInsumos);
  document
    .querySelector("#btnCargarUsuarios")
    .addEventListener("click", cargarVistaGestionUsuarios);
  document
    .querySelector("#btnEnfermedades")
    .addEventListener("click", cargarVistaGestionEnfermedades);
  document
    .querySelector("#btnVacunas")
    .addEventListener("click", cargarVistaGestionVacunas);
  document.querySelector("#animales").innerHTML = `<div class="card" >
      <div class="card">
        <div class="card-header">
          Animales registrados
        </div>
      <div class="card-body text-center">
        <h1 class="card-title">${animales.length}</h5>
        <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
        <a href="#" class="btn btn-primary">Go somewhere</a>
      </div>
      <div class="card-footer text-muted">
        2 days ago
      </div>
    </div>`;
  document.querySelector("#usuarios").innerHTML = `<div class="card" >
      <div class="card">
        <div class="card-header">
          Usuarios registrados
        </div>
      <div class="card-body text-center">
        <h1 class="card-title">${usuario.length}</h5>
        <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
        <a href="#" class="btn btn-primary">Go somewhere</a>
      </div>
      <div class="card-footer text-muted">
        2 days ago
      </div>
    </div>`;
  document.querySelector("#vacunas").innerHTML = `<div class="card" >
      <div class="card">
        <div class="card-header">
          Vacunas registrados
        </div>
      <div class="card-body text-center">
        <h1 class="card-title">${cantidadVacunas}</h5>
        <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
        <a href="#" class="btn btn-primary">Go somewhere</a>
      </div>
      <div class="card-footer text-muted">
        2 days ago
      </div>
    </div>`;
};

document
  .querySelector("#btnCerrarSesion")
  .addEventListener("click", cerrarSesion);

async function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

async function convertImage(input, id) {
  const animalId = localStorage.getItem("idAnimal");
  const file = input.files[0];
  // localStorage.setItem("imagen",JSON.stringify(file));
  return;
  if (file.type === "image/jpg" || file.type === "image/jpeg") {
    const path = "animales/" + animalId + "/profile.jpg";
    let storageRef = firebase.storage().ref();
    let fotoRef = storageRef.child(path);
    Swal.showLoading();
    fotoRef.putString(await toBase64(file), "data_url").then(async function () {
      await agregarFotoAlModal();
      Swal.fire({
        icon: "success",
        title: "Listo",
        text: "Foto actualizada",
      });
    });
  } else {
    console.log(
      "Error",
      "Solo se pueden cargar imagenes con formato jpg o jpge"
    );
    Swal.fire({
      icon: "error",
      title: "Advertencia",
      text: "Solo se pueden cargar imagenes con formato jpg o jpge",
    });
  }
}
// Colocar la informacion en el modal de visualizacion detalles
async function guardarIdAnimal(idAnimal) {
  document
    .querySelector("#foto-animal")
    .setAttribute(
      "src",
      "https://previews.123rf.com/images/godruma/godruma1710/godruma171000086/87282077-vista-de-perfil-animal-de-longitud-completa-de-bull-en-vaca-muscular-marr%C3%B3n.jpg?fj=1"
    );
  localStorage.setItem("idAnimal", idAnimal);
  let data = localStorage.getItem("animales");
  if (!data) return;
  data = JSON.parse(data);
  const item = data.find((el) => el.id === idAnimal);
  if (!item) return;
  console.log(item);
  document.querySelector("#label-animal-nombre").textContent =
    item.nombre || "N/A";
  document.querySelector("#label-detalles-animal").textContent =
    item.detalles || "N/A";
  document.querySelector("#label-animal-fechaNacimiento").textContent =
    item.fecha_nacimiento || "N/A";
  if (item.genero == false) {
    document.querySelector("#label-animal-genero").textContent = "Hembra";
  } else {
    document.querySelector("#label-animal-genero").textContent = "Macho";
  }
  console.log(item.vacunas);
  let filas = item.vacunas.map(
    (u, i) => `<tr>
                  <td>${i}</t>
                  <td>${u.name || "N/A"}</td>
                  <td>${u.create_at}</td>
                </tr>
                `
  );
  console.log(filas);
  var tablaVacunas = `<table class="table">
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Fecha Vacunacion</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${filas.join("")}
                        </tbody>
                      </table>`;
  document.querySelector(`#vacunas-son`).innerHTML = tablaVacunas;
  await agregarFotoAlModal();
}

// Agregar foto al modal de detalles
async function agregarFotoAlModal() {
  const id = localStorage.getItem("idAnimal");
  const storageRef = firebase.storage().ref();
  storageRef
    .child(`animales/${id}/profile.jpg`)
    .getDownloadURL()
    .then((url) => {
      document.querySelector("#foto-animal").setAttribute("src", url);
    })
    .catch((error) => {});
  localStorage.removeItem("idAnimal");
}

// Agregar foto al modal de agregar animal
async function agregarFoto() {
  document
    .querySelector("#agregar-foto-animal")
    .setAttribute(
      "src",
      "https://previews.123rf.com/images/godruma/godruma1710/godruma171000086/87282077-vista-de-perfil-animal-de-longitud-completa-de-bull-en-vaca-muscular-marr%C3%B3n.jpg?fj=1"
    );
  const id = localStorage.getItem("idAnimal");
  const storageRef = firebase.storage().ref();
  storageRef
    .child(`animales/${id}/profile.jpg`)
    .getDownloadURL()
    .then((url) => {
      document.querySelector("#agregar-foto-animal").setAttribute("src", url);
    })
    .catch((error) => {});
}

//Colocar en venta el animal
async function colocarVentaAnimal() {
  const url = localStorage.getItem("api");
  const idAnimal = localStorage.getItem("idEliminar");
  let data = localStorage.getItem("animales");
  if (!data) return;
  data = JSON.parse(data);
  console.log(idAnimal);
  const item = data.find((el) => el.id == idAnimal);
  console.log(item);
  console.log(data);
  if (!item) return;
  let parametros = {
    id: idAnimal,
    enVenta: !item.enVenta,
  };
  await fetch(url + "animales", {
    method: "PUT",
    body: JSON.stringify(parametros),
    headers: {
      "Content-Type": "application/json",
    },
  });
  cargarVistaGestionAnimal();
}
