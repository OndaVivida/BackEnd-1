// implementacion de FileSystem sin terminar

import { json, Router, urlencoded } from "express";
import { agregarGestorAlReq } from "../../middlewares/productos.middleware.js";
import { uploader } from "../../utils.js";

const router = Router()

router.use(agregarGestorAlReq)

router.get("/", async (req, res, next) => {
    // Obtiene los productos
    try {
        const productos = await req.gestorProductos.obtenerTodosProductos()
        res.status(200).json(productos)
    } catch (error) {
        next(error)
    }
})

router.delete("/:id", async (req, res, next) => {
    // Elimina un producto
    try {
        await req.gestorProductos.eliminarProductoPorID(req.params.id)
        res.status(200).send("Producto eliminado")
    } catch (error) {
        next(error)
    }
})

// Esto es para que acepte JSON y Datos de formulario, los que estan arriba no los usan
router.use(json(), urlencoded({extended: true}))

router.put("/:id", uploader.single("thumbnails"), async (req, res, next) => {
    // Actualiza un producto
    try {
        req.file ? req.body.thumbnails = `images/${req.file.filename}` : console.log("No se agrego imagen")
        await req.gestorProductos.actualizarProductoPorID(req.params.id, req.body)
        res.status(200).send("Producto Actualizado")
    } catch (error) {
        next(error)
    }
})

router.post("/", uploader.single("thumbnails"), async (req, res, next) => {
    // Crea un producto
    try {
        req.file ? req.body.thumbnails = `images/${req.file.filename}` : console.log("No se agrego imagen")
        console.log(req.file)
        await req.gestorProductos.crearProducto(req.body)
        res.status(201).send("Producto creado")
    } catch (error) {
        next(error)
    }
})

router.use((err, req, res, next) => {
    res.status(500).json({Error: err.message})
})

export default router