export async function validadorFormularioProductos(req, res, next) {
    const entrada = {...req.body}
    for (const propiedad in entrada) {
        if (entrada[propiedad] === "")
            entrada[propiedad] = undefined
    }
    if (entrada.status) {
        if (entrada.status === "on")
            entrada.status = true
    } else {
        entrada.status = false
    }
    req.body = entrada
    next()
}