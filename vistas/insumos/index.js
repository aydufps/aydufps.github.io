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

async function guardarInsumo() {
  let data = {
    nombre: document.querySelector("#nombre-inusumo").value,
    detalles: document.querySelector("#detalle-insumo").value,
    unidades: document.querySelector("#cantidad-insumo").value,
  };
  let insumo = await fetch("https://aydfincas.herokuapp.com/insumos", {
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
    
    document.querySelector("#guardar-insumo").addEventListener("click", guardarInsumo);
  } catch (error) {
    console.log(error);
    alert("no entra al sistema de encabesado");
  }
}

async function cargarVistaGestionInsumos() {
  cargaContenidoInsumos();
  try {
    const url = "/vistas/insumos/index.html";
    const html = await fetch(url).then((r) => r.text());
    const animales = await obtenerInsumos();
    let filas = animales.map(
      (u, i) => `<tr>
                      <td>${u.nombre}</td>
                      <td>${u.detalles}</td>
                      <td>${u.unidades}</td>
                      <td>${u.estado ? "Activa" : "Inactiva"}</td>
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
