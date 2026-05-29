// clientSocket importado desde webSocket-generico.productos.js

document.getElementById("formularioCrearProd").onsubmit = async function (formulario) {
    formulario.preventDefault()
    const productoCreado = new FormData(this) 
    try {
        const respuesta = await fetch(this.action, {
            method: this.method,
            body: productoCreado
        })
        if (respuesta.ok) {
            const datos = await respuesta.json()
            clientSocket.emit("creacionProducto", datos)
        } else {
            const datos = {numero : respuesta.status, mensaje : await respuesta.json()}
            throw new Error(JSON.stringify(datos))
        }
    } catch (err) {
        const error = JSON.parse(err.message)
        const erroresManejables = [400, 409]
        console.warn("Advertencia: ", error)
        if (erroresManejables.includes(error.numero)) {
            clientSocket.emit("error", error)
        } else {
            console.error("Error Fatal: ", error)
        }
    }
}