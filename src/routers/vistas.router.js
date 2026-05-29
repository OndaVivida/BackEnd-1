import { Router } from "express";
import vistaProductos from "./vistas/vista.productos.router.js"
import vistaCarrito from "./vistas/vista.carrito.router.js"
import vistasGestorProductos from "./vistas/vistas.gestorProductos.router.js"
import vistaProductoDetalle from "./vistas/vista.producto.detalle.router.js"

const router = Router()

// originalmente las rutas estaban en español, la entrega solicita rutas en especifico.
// se modificaron todas las rutas como se solicita.
router.use("/gestor", vistasGestorProductos)
router.use("/products", vistaProductos) // originalmente era /productos
router.use("/cart", vistaCarrito) // originalmente era /carrito
router.use("/product", vistaProductoDetalle) // originalmente era /producto

router.get("/", (req, res) => {
    res.render("index", {
        title : "Inicio",
        script : ["js/asignadorCarritos.js"]
    })
})

export default router