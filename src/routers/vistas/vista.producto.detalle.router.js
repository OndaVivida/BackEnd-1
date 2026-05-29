import { Router } from "express";
import { productModel } from "../../models/productModel.js";

const router = Router()

router.get("/:prodID", async (req, res, next) => {
    let titulo = "Error"
    let producto
    let estado
    const error = {}
    try {
        producto = await productModel.findById(req.params.prodID).lean()
        if (producto) {
            estado = 200
            titulo = "Producto"
        } else {
            estado = 404
            error.descripcion = "El producto no existe"
        }
    } catch (err) {
        if (err.message.includes("Cast to ObjectId failed")) {
            estado = 400
            error.descripcion = "El id de producto es erroneo"
        } else {
            estado = 500
            error.descripcion = "Se produjo un error en el servidor"
            console.log(err)
        }
    }
    error.numero = estado
    res.status(estado).render("productoDetalle", {
        title : titulo,
        script : ["/js/asignadorCarritos.js"],
        producto,
        error
    })
})

export default router