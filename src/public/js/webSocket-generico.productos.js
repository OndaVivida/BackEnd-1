const clientSocket = io()

clientSocket.on("actualizarVisualizacion", ({producto, operacion}) => {
    try {
        let contenedorProd = document.getElementById("ultimaActualizacion")
        if (!contenedorProd) {
            contenedorProd = document.createElement("div")
            contenedorProd.setAttribute("class", "cuerpo")
            contenedorProd.setAttribute("id", "ultimaActualizacion")
        }
        contenedorProd.innerHTML = `
            <h3>Ultima actualizacion de productos: <span class="negrita">${operacion}</span></h3>
            <p class="negrita">Titulo: <span class="negrita">${producto.title}</span></p>
            <p>Descripcion: ${producto.description}</p>
            <img src="${producto.thumbnails}" alt="Imagen del producto ${producto._id}">
            <p>Categoria: <span class="negrita">${producto.category}</span>. Stock: <span class="negrita">${producto.stock}</span>. <span class="negrita">$${producto.price}</span></p>
            <p>Codigo: <span class="negrita">${producto.code}</span>. Disponible <span class="negrita">${producto.status}</span>.</p>
            <p>id: <span class="negrita">${producto._id}</span></p>
                                    `
        document.querySelector("body").insertBefore(contenedorProd, document.getElementById("pieDePagina"))
    } catch (error) {
        console.error(error)
    }
})

clientSocket.on("errorProd", (err) => {
    try {
        let contenedorProd = document.getElementById("ultimaActualizacion")
        if (!contenedorProd) {
            contenedorProd = document.createElement("div")
            contenedorProd.setAttribute("class", "cuerpo")
            contenedorProd.setAttribute("id", "ultimaActualizacion")
        }
        contenedorProd.innerHTML = `
            <h3>ERROR ${err.numero}: <p class="negrita">${err.mensaje}</p></h3>
                                    `
        document.querySelector("body").insertBefore(contenedorProd, document.getElementById("pieDePagina"))
    } catch (error) {
        console.error(error)
    }
})