const clientSocket = io()

clientSocket.on("actualizacionDeApiProducts", async () => {
    actualizador()
})

async function actualizador () {
    const params = new URLSearchParams(window.location.search)
    const pagina = params.get("page") || 1
    const respuesta = await fetch(`/api/products/?page=${pagina}`)
    const productos = (await respuesta.json()).docs
    const listaProductos =  document.getElementById("contenedorProductos")
    if (productos.length) {
        listaProductos.innerHTML = ""
        productos.forEach(producto => {
            const contenedor = document.createElement("div")
            contenedor.setAttribute("class", "productos")
            contenedor.innerHTML = `
                <h3>${producto.title}</h3>
                <img src="${producto.thumbnails}" alt="Imagen del producto ${producto._id}">
                <p>${producto.description}</p>
                <p><span class="precio">$${producto.price}</span></p>
                <a class="boton" href="/product/${producto._id}">Ver Producto</a>
            `
            listaProductos.appendChild(contenedor)
        })
    }
}

actualizador()