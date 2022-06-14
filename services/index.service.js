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
  cargarDatosDeUsuario();
}

async function cargarVistaGestionAnimal() {
  try {
    const url = "/vistas/animales/index.html";
    const html = await fetch(url).then((r) => r.text());
    const animales = await obtenerAnimales();
    let filas = animales.map(
      (u, i) => `<tr>
                    <td>${u.nombre}</td>
                    <td>${u.detalles}</td>
                    <td>${u.fecha_nacimiento}</td>
                    <td>${u.estado ? "Activa" : "Inactiva"}</td>
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
  iniciarPagina();
};

document
  .querySelector("#btnCerrarSesion")
  .addEventListener("click", cerrarSesion);
document
  .querySelector("#btnCargarAnimal")
  .addEventListener("click", cargarVistaGestionAnimal);
