const menuLateralComponent = "menulateral";

function addGestionAnimales() {
  const id = "btnAgregarAnimales";
  const html = `<a class="d-block" id="${id}"><i class="fas fa-cow mr-2"></i>Animales</a>`;
  document.querySelector(`#${menuLateralComponent}`).innerHTML = html;
  document
    .querySelector(`#${id}`)
    .addEventListener("click", cargarVistaGestionAnimal);
}

async function cargarMenulateral() {
  try {
    let usuario = JSON.parse(localStorage.getItem("usuario"));
    console.log(usuario);
    // switch (usuario.rol_id) {
    //   case ROLES.ADMINISTRADOR:
    //     addGestionAnimales();
    //     document.querySelector("#rolLabel").textContent = "ADMINISTRADOR";
    //     break;
    //   case ROLES.VETERINARIO:
    //     addGestionAnimales();
    //     document.querySelector("#rolLabel").textContent = "VETERINARIO";
    //     break;
    //   case ROLES.CAPATAZ:
    //     addGestionAnimales();
    //     document.querySelector("#rolLabel").textContent = "CAPATAZ";
    //     break;
    //   default:
    //     break;
    // }
  } catch (error) {
    console.log(error);
  }
}

cargarMenulateral();
