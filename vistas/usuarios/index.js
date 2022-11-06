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

  let usuario = await fetch(
    "https://flask-service.4csvpc17p5v1q.us-east-1.cs.amazonlightsail.com/usuarios",
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).then((res) => res.json());
  cargarVistaGestionUsuarios();
  console.log(usuario);
}

async function borraridUsuario() {
  localStorage.removeItem("idEliminar");
}

async function guardarIdUsuario(id) {
  localStorage.setItem("idEliminar", id);
}

async function actualizarInformacionUsuario() {
  const usuarioId = localStorage.getItem("idEliminar");
  var actualizarNombre = document.querySelector("#actulizar-nombre").value;
  var actualizarCorreo = document.querySelector("#actualizar-correo").value;
  var actualizarRoolis = document.querySelector("#actualizar-rol").value;
  if (
    actualizarNombre != "" &&
    actualizarCorreo != "" &&
    actualizarRoolis != ""
  ) {
    let data = {
      id: usuarioId,
      nombre: document.querySelector("#actulizar-nombre").value,
      correo: document.querySelector("#actualizar-correo").value,
      rol_id: document.querySelector("#actualizar-rol").value,
    };
    fetch(
      "https://flask-service.4csvpc17p5v1q.us-east-1.cs.amazonlightsail.com/usuarios",
      {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((res) => {
      cargarVistaGestionUsuarios();
      localStorage.removeItem("idEliminarUsuario");
    });
  } else {
    alert("Complete todos los cambios");
  }
}

async function eliminarUsuario() {
  var id = localStorage.getItem("idEliminar");
  const usuario = await obtenerUsuarios();
  for (let index = 0; index < usuario.length; index++) {
    if (usuario[index].id == id) {
      if (usuario[index].rol_id != 1) {
        fetch(
          "https://flask-service.4csvpc17p5v1q.us-east-1.cs.amazonlightsail.com/usuario/" +
            id,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        ).then((res) => {
          cargarVistaGestionUsuarios();
          localStorage.removeItem("idEliminarUsuario");
        });
      } else {
        alert("Es un usuario Administardor");
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
      .addEventListener("click", borraridUsuario);
    document
      .querySelector("#si-eliminar-usuario")
      .addEventListener("click", eliminarUsuario);
    document
      .querySelector("#si-actualizar-usuario")
      .addEventListener("click", actualizarInformacionUsuario);
    document
      .querySelector("#no-actualizar-usuario")
      .addEventListener("click", borraridUsuario);
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
                            <a class="float-right mr-3" data-toggle="modal" href="#ventana3" >
                              <button class="float-right btn btn-primary" onclick="guardarIdUsuario(${
                                u.id
                              })">
                                <i class="fas fa-edit"></i>
                              </button>
                            </a>
                            <a class="float-right mr-3" data-toggle="modal" href="#ventana2" id="buton-eliminar-usuario">
                              <button class="float-right btn btn-danger" id="btn-eliminar-usuario" onclick="guardarIdUsuario(${
                                u.id
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

window.onload = async function () {};
