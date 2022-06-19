

async function obtenerEnfermedades() {
    let data = await fetch(API + "enfermedades", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    }).then((res) => res.json());
    if (data) {
        return data;
    }
}

async function guardarEnfermedad() {
    let data = {
      nombre: document.querySelector("#nombre-enfermedad").value,
      detalles: document.querySelector("#detalle-enfermedad").value,
    };
    let insumo = await fetch("https://aydfincas.herokuapp.com/enfermedades", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
    cargarVistaGestionEnfermedades();
    console.log(insumo);
  }

async function cargaContenidoEnfermedad() {
    try {
      const url = `/vistas/enfermedades/index.html`;
      const html = await fetch(url).then((r) => r.text());
      const urlEncabezado = `/vistas/enfermedades/encabezado.html`;
      const htmlEncabezado = await fetch(urlEncabezado).then((r) => r.text());
  
      document.querySelector("#contenido-dinamico").innerHTML = html;
      document.querySelector("#encabezado-dinamico").innerHTML = htmlEncabezado;
      
      document.querySelector("#guardar-enfermedad").addEventListener("click", guardarEnfermedad);
    } catch (error) {
      console.log(error);
      alert("no entra al sistema de encabesado");
    }
  }

async function cargarVistaGestionEnfermedades() {
    cargaContenidoEnfermedad();
    try {
        const url = "/vistas/enfermedades/index.html";
        const html = await fetch(url).then((r) => r.text());
        const enfermedades = await obtenerEnfermedades();
        let filas = enfermedades.map(
            (u, i) => `<tr>
                        <td>${u.id}</td>
                        <td>${u.nombre}</td>
                        <td>${u.detalles}</td>
                      </tr>`
        );
        document.querySelector("#contenido-dinamico").innerHTML = html;
        document.querySelector("#enfermedades-body").innerHTML = filas;
        new JSTable("#enfermedades-table", {
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
