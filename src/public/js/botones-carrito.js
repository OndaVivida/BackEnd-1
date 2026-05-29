const cID = JSON.parse(localStorage.getItem("carrito"))

function activarBotones () {
    const api = `/api/carts/${cID}`

    document.getElementById("vaciarCarrito")?.addEventListener("click", () => {
        fetch(api, {method : "delete"})
            .then(() => window.location.replace("/products"))
            .catch((error) => console.error(error))
    })
    document.getElementById("eliminarCarrito")?.addEventListener("click", () => {
        fetch(`${api}?eliminar=true`, {method : "delete"})
            .then(() => localStorage.removeItem("carrito"))
            .then(() => window.location.replace("/products"))
            .catch((error) => console.error(error))
    })
}

if (cID) activarBotones()