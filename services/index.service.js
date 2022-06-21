const componentanimal = "animales";

function cerrarSesion() {
  window.location.replace("/vistas/login/login.html");
}

async function cargarDatosDeUsuario() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  switch (usuario.rol_id) {
    case ROLES.ADMINISTRADOR:
      document.querySelector("#rolLabel").textContent = "ADMINISTRADOR";
      break;
    case ROLES.VETERINARIO:
      document.querySelector("#rolLabel").textContent = "VETERINARIO";
      break;
    case ROLES.CAPATAZ:
      document.querySelector("#rolLabel").textContent = "CAPATAZ";
      break;
    default:
      break;
  }
}

async function existeUnLogueado() {
  try {
    const usuario = localStorage.getItem("usuario");
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
  let data = {
    nombre: document.querySelector("#nombre-animal").value,
    genero: document.querySelector("#genero-animal").value,
    detalles: document.querySelector("#detalles-animal").value,
    padre_id: document.querySelector("#select-padre").value,
    madre_id: document.querySelector("#select-madre").value,
    fecha_nacimiento: document.getElementById("fecha-nacimiento-animal").value,
  };

  let animal = await fetch("https://aydfincas.herokuapp.com/animales", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
  cargarVistaGestionAnimal();
  console.log(animal);
}

async function guardaridAnimal(id) {
  localStorage.setItem("idEliminar", id);
}

async function eliminarAnimal() {
  const id = localStorage.getItem("idEliminar");
  fetch("https://aydfincas.herokuapp.com/animal/" + id, {
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
  id_vacuna = document.querySelector("#selected-vacuna").value;
  console.log(id_vacuna);
  let data = {
    animal_id: localStorage.getItem("idEliminar"),
    vacuna_id: document.querySelector("#selected-vacuna").value,
  };
  fetch("https://aydfincas.herokuapp.com/animales/vacunas", {
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
      fetch("https://aydfincas.herokuapp.com/vacunas", {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
    }
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
    const url = "/vistas/animales/index.html";
    const html = await fetch(url).then((r) => r.text());
    const animales = await obtenerAnimales();
    const nombrevacuna = {};
    for (let index = 0; index < animales.length; index++) {
      console.log(animales[index].vacunas);
    }
    //console.log(animales);
    let filas = animales.map(
      (u, i) => `<tr>
                    <td>${u.nombre}</td>
                    <td>${u.detalles}</td>
                    <td>${u.fecha_nacimiento}</td>
                    <td>${u.genero ? "Macho" : "Hembra"}</td>
                    <td>${u.madre_id}</td>
                    <td>${u.padre_id}</td>
                    <td>${u.estado ? "Activa" : "Inactiva"}</td>
                    <td style="margin:center;">
                        <a class="float-right mr-3" data-toggle="modal" href="#ventana3" id="buton-vacuna">
                          <button class="float-right btn btn-primary" id="boton-agregar-vacuna" onclick="guardaridAnimal(${
                            u.id
                          })">
                          <i class="fas fa-syringe"></i>
                          </button>
                        </a>
                        <a class="float-right mr-3" data-toggle="modal" href="#ventana2" id="buton-eliminar">
                          <button class="float-right btn btn-danger" id="boton-eliminar-animal" onclick="guardaridAnimal(${
                            u.id
                          })">
                            <i class="fas fa-trash-alt"></i>
                          </button>
                        </a>
                    </td>
                    <td>
                        
                    </td>
                  </tr>`
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
};

document
  .querySelector("#btnCerrarSesion")
  .addEventListener("click", cerrarSesion);
