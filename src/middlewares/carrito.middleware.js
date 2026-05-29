import GestorCarrito from "../dao/GestorCarrito.js";

export async function agregarGestorAlReq(req, res, next) {
    req.gestorCarrito = GestorCarrito
    next()
}