import GestorProductos from "../dao/GestorProductos.js"

export async function agregarGestorAlReq(req, res, next) {
    req.gestorProductos = GestorProductos
    next()
}