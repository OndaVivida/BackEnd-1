// clientSocket importado desde webSocket-generico.productos.js

async function actualizarDatos (producto) {
    const form = (document.getElementById("formularioEditarProd"))
    const {thumbnails, ...claves} = producto
    for (const [key, value] of Object.entries(claves)) {
        if (form[key]) {
            console.log(key, value)
            form[key].value = value
        }
    }
}

document.getElementById("formularioObtenerProd").onsubmit = async function (formulario) {
    formulario.preventDefault()
    try {
        const id = this._id.value
        const respuesta = await fetch(`/api/products/${id}`, {
            method: "get"
        })
        console.log(respuesta)
        if (respuesta.ok) {
            const datos = await respuesta.json()
            await actualizarDatos(datos)
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

document.getElementById("formularioEditarProd").onsubmit = async function (formulario) {
    formulario.preventDefault()
    const productoModificado = new FormData(this)
    try {
        const id = document.getElementById("formularioObtenerProd")._id.value
        const respuesta = await fetch(`/api/products/${id}`, {
            method: "put",
            body: productoModificado
        })
        if (respuesta.ok) {
            const datos = await respuesta.json()
            clientSocket.emit("actualizacionProducto", datos)
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