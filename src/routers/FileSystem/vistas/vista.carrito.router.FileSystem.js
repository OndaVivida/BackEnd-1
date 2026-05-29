import { Router } from "express";
import GestorProductos from "../../../dao/GestorProductos.js";
import GestorCarrito from "../../../dao/GestorCarrito.js";
import vistasGestorProductos from "./vistas.gestorProductos.router.js"

const router = Router()

router.use("/gestor", vistasGestorProductos)

// res.render es el método para las plantillas, el primer parametro es el nombre de la vista
router.get("/", (req, res) => {
    res.render("index", {
        nombreDeVariable : "teteo epico que se debería de ver en el index.handlebars",
        title : "Inicio"
    })
})

router.get("/productos", async (req, res) => {
    const productos = await GestorProductos.obtenerTodosProductos()
    res.render("productos", {
        title : "Tienda",
        estilo: ["/css/estiloTienda.css"],
        productos
    })
})

router.get("/carrito/:cartID", async (req, res, next) => {
    let carrito = ""
    try {
        const {products} = await GestorCarrito.obtenerCarrito(req.params.cartID)
        carrito = products
        console.log(carrito)
    } catch (error) {
        if (error.message == `ERROR AL OBTENER EL CARRITO. EL CARRITO NO EXISTE.`) {
            carrito = ""
        } else {
            next(error)
        }
    }
    res.render("carrito", {
        title : "Carrito",
        estilo: ["/css/estiloCarrito.css"],
        carrito
    })
})

export default router