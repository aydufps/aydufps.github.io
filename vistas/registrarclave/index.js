
async function registrarClave() {
    alert();

    var clave = document.querySelector("#nueva-clave").value;
    var conClave = document.querySelector("#confirmar-nueva-clave").value;

    if (clave == conClave) {
        var valor_id = window.location.search;
        const urlParams = new URLSearchParams(valor_id);
        var id = urlParams.get('id');
        alert(id);
    }

}

document.querySelector("#registrar-clave").addEventListener("click", registrarClave);