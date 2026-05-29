import { Router } from "express";
import { productModel } from "../../models/productModel.js";

const router = Router()

router.get("/", async (req, res) => {
    const {limit, page} = req.query
    const productos = await productModel.paginate({status : true}, {
        lean : true,
        limit,
        page
    })
    res.render("productos", {
        title : "Tienda",
        estilo : ["/css/estiloTienda.css"],
        script : ["/socket.io/socket.io.js", "/js/webSocket-tienda.js", "/js/asignadorCarritos.js"],
        productos
    })
})

export default router