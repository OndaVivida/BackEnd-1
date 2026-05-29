const existeCarrito = JSON.parse(localStorage.getItem("carrito"))

function navBar() {
    const navBarCarrito = document.getElementById("navBarCarrito")
    if (navBarCarrito) {
        const carritoID = JSON.parse(localStorage.getItem("carrito"))
        navBarCarrito.href = `/cart/${carritoID}`
    }
}

function botonAlCarrito () {
    const addAlCarrito = document.getElementById("addAlCarrito")
    if (addAlCarrito) {
        addAlCarrito.onclick = async () => {
            try {
                let cID = JSON.parse(localStorage.getItem("carrito")) || await crearCarrito()
                const pID = addAlCarrito.dataset.producto
                const respuesta = await fetch(`/api/carts/${cID}/products/${pID}`, {method: "post"})
                if (respuesta.status === 404) {
                    cID = await crearCarrito()
                    const response = await fetch(`/api/carts/${cID}/products/${pID}`, {method: "post"})
                    if (!response.ok) throw new Error(response)
                }
            } catch (error) {
                console.error(error)
            }
        }
    }
}

async function crearCarrito () {
    try {
        const respuesta = await fetch("/api/carts/", {method: "post"})
        const datos = await respuesta.json()
        localStorage.setItem("carrito", JSON.stringify(datos.id))
        navBar()
        return datos.id
    } catch (error) {
        console.error(error)
    }
}

if (!existeCarrito) {
    crearCarrito()
    .then(() => {
        botonAlCarrito()
        navBar()
    })
} else {
    botonAlCarrito()
    navBar()
}