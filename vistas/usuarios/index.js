const component = "usuarios";

async function obtenerUsuarios() {
  let data = await fetch(API + "usuarios", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
  if (data) {
    return data;
  }
}

async function guardarUsuario() {
  let data = {
    name: document.querySelector("#nombre-personal").value,
    rol_id: document.querySelector("#rol-persomnal").value,
    email: document.querySelector("#email-personal").value,
  };

  let usuario = await fetch("https://aydfincas.herokuapp.com/usuarios", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
  cargarVistaGestionUsuarios();
  console.log(usuario);
}

async function borraridAnimal() {
  localStorage.removeItem("idEliminar");
}

async function guardaridUsuario(id) {
  localStorage.setItem("idEliminar", id);
}

async function eliminarUsuario() {
  const id = localStorage.getItem("idEliminar");
  let usuario = await obtenerUsuarios();
  console.log(usuario);
  for (let index = 0; index < usuario.length; index++) {
    if (usuario[index].id == id) {
      if (usuario[index].rol_id != 1) {
        fetch("https://aydfincas.herokuapp.com/usuario/" + id, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => {
          cargarVistaGestionUsuarios();
          localStorage.removeItem("idEliminarUsuario");
        })
      } else {
        alert("Es un usuario administardor");
      }
    }
  }
}

async function cargaContenidoUsuario() {
  try {
    const url = `/vistas/${component}/index.html`;
    const html = await fetch(url).then((r) => r.text());
    const urlEncabezado = `/vistas/${component}/encabezado.html`;
    const htmlEncabezado = await fetch(urlEncabezado).then((r) => r.text());

    document.querySelector("#contenido-dinamico").innerHTML = html;
    document.querySelector("#encabezado-dinamico").innerHTML = htmlEncabezado;

    document
      .querySelector("#guardar-personal")
      .addEventListener("click", guardarUsuario);
    document
      .querySelector("#no-eliminar-usuario")
      .addEventListener("click", borraridAnimal);
    document
      .querySelector("#si-eliminar-usuario")
      .addEventListener("click", eliminarUsuario);

  } catch (error) {
    console.log(error);
    alert("no entra al sistema de encabesado");
  }
}

async function cargarVistaGestionUsuarios() {
  cargaContenidoUsuario();
  try {
    const url = `/vistas/${component}/index.html`;
    const html = await fetch(url).then((r) => r.text());
    const usuario = await obtenerUsuarios();
    for (let index = 0; index < usuario.length; index++) {
      if (usuario[index].rol_id == 1) {
        usuario[index].rol_id = "Administrador";
      } else if (usuario[index].rol_id == 2) {
        usuario[index].rol_id = "Capataz";
      } else {
        usuario[index].rol_id = "Veterinario";
      }
    }
    let filas = usuario.map(
      (u, i) => `<tr>
                        <td>${u.nombre}</td>
                        <td>${u.correo}</td>
                        <td>${u.rol_id}</td>
                        <td>${u.estado ? "Activa" : "Inactiva"}</td>
                        <td style="margin:center;">
                            <a class="float-right mr-3" data-toggle="modal" href="#ventana3" id="buton-vacuna">
                              <button class="float-right btn btn-primary" id="boton-agregar-vacuna" >
                                <i class="fas fa-edit"></i>
                              </button>
                            </a>
                            <a class="float-right mr-3" data-toggle="modal" href="#ventana2" id="buton-eliminar-usuario">
                              <button class="float-right btn btn-danger" id="btn-eliminar-usuario" onclick="guardaridAnimal(${u.id
        })">
                                <i class="fas fa-trash-alt"></i>
                              </button>
                            </a>
                        </td>
                </tr>`
    );
    document.querySelector("#contenido-dinamico").innerHTML = html;
    document.querySelector(`#${component}-body`).innerHTML = filas;
    new JSTable(`#${component}-table`, {
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
