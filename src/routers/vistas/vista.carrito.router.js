import { Router } from "express";
import { cartModel } from "../../models/cartModel.js";

const router = Router()

router.get("/:cartID", async (req, res, next) => {
    let titulo = "Error"
    let carrito
    let estado
    const error = {}
    try {
        carrito = await cartModel.findById(req.params.cartID).lean().populate("products.product")
        if (carrito) {
            estado = 200
            titulo = "Carrito"
        } else {
            carrito = ""
            estado = 404
            error.descripcion = "El carrito no existe"
        }
    } catch (err) {
        if (err.message.includes("Cast to ObjectId failed")) {
            estado = 400
            error.descripcion = "El id no corresponde a un carrito válido"
        } else {
            estado = 500
            error.descripcion = "Se produjo un error en el servidor"
            console.log(err)
        }
    }
    error.numero = estado
    res.status(estado).render("carrito", {
        title : titulo,
        estilo : ["/css/estiloCarrito.css"],
        script : ["/js/botones-carrito.js"],
        carrito,
        error
    })
})

export default router