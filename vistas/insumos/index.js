const componentinsumo = "insumos";

async function obtenerInsumos() {
  let data = await fetch(API + "insumos", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
  if (data) {
    return data;
  }
}

async function guardarIdinsumo(id) {
  localStorage.setItem("idInsumo", id);
}

async function borraridInsumo() {
  localStorage.removeItem("idInsumo");
}

async function eliminarInsumo() {
  const url = localStorage.getItem("api");
  var id = localStorage.getItem("idEliminar");
  const insumo = await obtenerInsumos();
  for (let index = 0; index < insumo.length; index++) {
    if (insumo[index].id == id) {
      fetch(url + "insumo/" + id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        cargarVistaGestionInsumos();
        localStorage.removeItem("idEliminar");
      });
    }
  }
}

async function guardarInsumo() {
  const url = localStorage.getItem("api");
  let data = {
    nombre: document.querySelector("#nombre-inusumo").value,
    detalles: document.querySelector("#detalle-insumo").value,
    unidades: document.querySelector("#cantidad-insumo").value,
  };
  let insumo = await fetch(url + "insumos", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
  cargarVistaGestionInsumos();
  console.log(insumo);
}

async function cargaContenidoInsumos() {
  try {
    const url = `/vistas/${componentinsumo}/index.html`;
    const html = await fetch(url).then((r) => r.text());
    const urlEncabezado = `/vistas/${componentinsumo}/encabezado.html`;
    const htmlEncabezado = await fetch(urlEncabezado).then((r) => r.text());

    document.querySelector("#contenido-dinamico").innerHTML = html;
    document.querySelector("#encabezado-dinamico").innerHTML = htmlEncabezado;

    document
      .querySelector("#guardar-insumo")
      .addEventListener("click", guardarInsumo);
    document
      .querySelector("#cancelar-insumo")
      .addEventListener("click", borraridInsumo);
    document
      .querySelector("#si-actualizar-insumo")
      .addEventListener("click", actualizarInsumo);

    document
      .querySelector("#si-eliminar-insumo")
      .addEventListener("click", eliminarInsumo);
  } catch (error) {
    console.log(error);
    alert("no entra al sistema de encabesado");
  }
}

async function actualizarInsumo() {
  const url = localStorage.getItem("api");
  const insumoId = localStorage.getItem("idInsumo");
  var actualizarCantidad = parseInt(
    document.querySelector("#nueva-cantidad").value
  );
  const insumo = await obtenerInsumos();
  if (actualizarCantidad != "") {
    for (let index = 0; index < insumo.length; index++) {
      console.log(insumoId);
      if (insumoId == insumo[index].id) {
        console.log("444");
        let data = {
          id: insumoId,
          nombre: insumo[index].nombre,
          detalles: insumo[index].detalles,
          unidades: actualizarCantidad,
        };
        fetch(url + "insumos", {
          method: "PUT",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => {
          cargarVistaGestionInsumos();
          localStorage.removeItem("idEliminarUsuario");
        });
      }
    }
  } else {
    alert("complete todos los campos");
  }
  // cargarVistaGestionInsumos();
}

async function cargarVistaGestionInsumos() {
  cargaContenidoInsumos();
  try {
    const url = "/vistas/insumos/index.html";
    const html = await fetch(url).then((r) => r.text());
    const insumos = await obtenerInsumos();
    let filas = insumos.map(
      (u, i) => `<tr>
                      <td>${u.nombre}</td>
                      <td>${u.detalles}</td>
                      <td>${u.unidades}</td>
                      <td>${u.estado ? "Activa" : "Inactiva"}</td>
                      <td>${u.create_at}</td>
                      <td style="margin:center;">
                            <a title="Agregar" class="float-right mr-3" data-toggle="modal" href="#ventana3" >
                              <button class="float-right btn btn-primary" onclick="guardarIdinsumo(${
                                u.id
                              })">
                              <i class="fas fa-plus"></i>
                              </button>
                            </a>
                            <a title="Eliminar" class="float-right mr-3" data-toggle="modal" href="#ventana2" id="buton-eliminar-usuario">
                              <button class="float-right btn btn-danger" id="btn-eliminar-usuario" onclick="guardarIdinsumo(${
                                u.id
                              })">
                                <i class="fas fa-trash-alt"></i>
                              </button>
                            </a>
                        </td>
                      </tr>`
    );
    document.querySelector("#contenido-dinamico").innerHTML = html;
    document.querySelector("#insumos-body").innerHTML = filas;
    new JSTable("#insumos-table", {
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

/* window.onload = async function () {
  console.log(1212);
  document
    .querySelector("#btnCargarInsumos")
    .addEventListener("click", cargarVistaGestionInsumos);
}; */
