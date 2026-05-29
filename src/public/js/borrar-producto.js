// clientSocket importado desde webSocket-generico.productos.js

document.getElementById("formularioBorrarProd").onsubmit = async function (formulario) {
    formulario.preventDefault()
    try {
        const id = this._id.value
        const respuesta = await fetch(this.action = `/api/products/${id}`, {
            method: "delete"
        })
        if (respuesta.ok) {
            const datos = await respuesta.json()
            clientSocket.emit("eliminacionProducto", datos)
        } else {
            const datos = {numero : respuesta.status, mensaje : await respuesta.json()}
            throw new Error(JSON.stringify(datos))
        }
    } catch (err) {
        const error = JSON.parse(err.message)
        const erroresManejables = [400, 404]
        console.warn("Advertencia: ", error)
        if (erroresManejables.includes(error.numero)) {
            clientSocket.emit("error", error)
        } else {
            console.error("Error Fatal: ", error)
        }
    }
}