async function obtenerVacunas() {
  let data = await fetch(API + "vacunas", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
  if (data) {
    return data;
  }
}

async function guardarIdvacuna(id) {
  localStorage.setItem("idVacuna", id);
}

async function borraridvacuna() {
  localStorage.removeItem("idVacuna");
}

async function guardarVacuna() {
  const url = localStorage.getItem("api");
  let data = {
    nombre: document.querySelector("#nombre-vacuna").value,
    detalles: document.querySelector("#detalle-vacuna").value,
    fecha_vencimiento_lote: document.querySelector("#fecha-vencimiemto-vacuna")
      .value,
    unidades: document.querySelector("#cantidad-vacuna").value,
  };
  let insumo = await fetch(url + "vacunas", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
  cargarVistaGestionVacunas();
  console.log(insumo);
}

async function fechaActual() {
  var fecha = new Date(); //Fecha actual
  var mes = fecha.getMonth() + 1; //obteniendo mes
  var dia = fecha.getDate(); //obteniendo dia
  var ano = fecha.getFullYear(); //obteniendo año
  if (dia < 10) {
    dia = "0" + dia; //agrega cero si el menor de 10
  }
  if (mes < 10) {
    mes = "0" + mes; //agrega cero si el menor de 10
  }
  document.getElementById("fecha-vencimiemto-vacuna").min =
    ano + "-" + mes + "-" + dia;
  document.getElementById("fecha-vencimiemto-vacuna").value =
    ano + "-" + mes + "-" + dia;
}

async function actualizarVacunas() {
  const url = localStorage.getItem("api");
  const vacunaId = localStorage.getItem("idVacuna");
  var actualizarCantidad = parseInt(
    document.querySelector("#nueva-cantidad-vacuna").value
  );
  const vacunas = await obtenerVacunas();
  if (actualizarCantidad != "") {
    for (let index = 0; index < vacunas.length; index++) {
      if (vacunaId == vacunas[index].id) {
        let data = {
          id: vacunaId,
          nombre: vacunas[index].nombre,
          detalles: vacunas[index].detalles,
          unidades: actualizarCantidad,
          fecha_vencimiento_lote: vacunas[index].fecha_vencimiento_lote,
        };
        fetch(url + "vacunas", {
          method: "PUT",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => {
          cargarVistaGestionVacunas();
          // localStorage.removeItem("idEliminarUsuario");
        });
      }
    }
  } else {
    alert("complete todos los campos");
  }
  // cargarVistaGestionInsumos();
}

async function cargaContenidoVacunas() {
  try {
    const url = `/vistas/vacunas/index.html`;
    const html = await fetch(url).then((r) => r.text());
    const urlEncabezado = `/vistas/vacunas/encabezado.html`;
    const htmlEncabezado = await fetch(urlEncabezado).then((r) => r.text());

    document.querySelector("#contenido-dinamico").innerHTML = html;
    document.querySelector("#encabezado-dinamico").innerHTML = htmlEncabezado;

    fechaActual();

    document
      .querySelector("#guardar-vacuna")
      .addEventListener("click", guardarVacuna);
    document
      .querySelector("#si-actualizar-vacuna")
      .addEventListener("click", actualizarVacunas);
  } catch (error) {
    console.log(error);
    alert("no entra al sistema de encabesado");
  }
}

async function cargarVistaGestionVacunas() {
  cargaContenidoVacunas();
  try {
    const url = "/vistas/vacunas/index.html";
    const html = await fetch(url).then((r) => r.text());
    const vacunas = await obtenerVacunas();
    let filas = vacunas.map(
      (u, i) => `<tr>
                        <td>${u.id}</td>
                        <td>${u.nombre}</td>
                        <td >${u.detalles}</td>
                        <td style="text-align: center;">${u.unidades}</td>
                        <td style="text-align: center;">${u.create_at}</td>
                        <td style="text-align: center;">${u.fecha_vencimiento_lote}</td>
                        <td style="text-align: center;">
                            <a title="Agregar" class="float-right mr-3" data-toggle="modal" href="#ventana2" >
                              <button class="float-right btn btn-primary" onclick="guardarIdvacuna(${u.id})">
                              <i class="fas fa-plus"></i>
                              </button>
                            </a>
                            <a title="Eliminar" class="float-right mr-3" data-toggle="modal" href="#ventana3" id="buton-eliminar-usuario">
                              <button class="float-right btn btn-danger" id="btn-eliminar-usuario" onclick="guardarIdvacuna(${u.id})">
                                <i class="fas fa-trash-alt"></i>
                              </button>
                            </a>
                        </td>
                      </tr>`
    );
    document.querySelector("#contenido-dinamico").innerHTML = html;
    document.querySelector("#vacunas-body").innerHTML = filas;
    new JSTable("#vacunas-table", {
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
