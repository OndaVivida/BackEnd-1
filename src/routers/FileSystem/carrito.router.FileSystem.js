// implementacion de FileSystem sin terminar

import { json, Router, urlencoded } from "express";
import { agregarGestorAlReq } from "../../middlewares/carrito.middleware.js";

const router = Router()

router.use(agregarGestorAlReq)

// GET /api/carts/:cid
// Listar productos del carrito
// Utilizar populate para traer información completa de los productos
router.get("/:cartID", async (req, res, next) => {
    try {
        const cID = parseInt(req.params.cartID)
        if (cID > 0) {
            const productos = await req.gestorCarrito.obtenerCarrito(cID)
            res.status(200).json(productos)
        } else {
            res.status(400).json("Error 400. EL CODIGO INGRESADO NO ES CORRECTO.")
        }
    } catch (error) {
        if (error.message.includes("EL CARRITO NO EXISTE.")) {
            res.status(404).json("Error 404. EL CARRITO NO EXISTE.")
        } else {
            next(error)
        }
    }
})

// DELETE /api/carts/:cid/products/:pid
// Eliminar producto del carrito
router.delete("/:cartID/products/:productID", async (req, res, next) => {
    try {
        const pID = parseInt(req.params.productID)
        const cID = parseInt(req.params.cartID)
        if (cID > 0 && pID > 0) {
            await req.gestorCarrito.eliminarProductoDelCarrito(pID, cID)
            res.status(200).send("Producto eliminado del carrito")
        } else {
            res.status(400).json("Error 400. EL CODIGO INGRESADO NO ES CORRECTO.")
        }
    } catch (error) {
        if (error.message.includes("EL PRODUCTO NO ESTA EN EL CARRITO.")) {
            res.status(304).send("Producto eliminado del carrito")
        } else if (error.message.includes("EL CARRITO NO EXISTE.")) {
            res.status(404).send("Error 404. EL CARRITO NO EXISTE.")
        } else {
            next(error)
        }
    }
})

// DELETE /api/carts/:cid
// Vaciar el carrito completo
router.delete("/:cartID", async (req, res, next) => {
    try {
        const cID = parseInt(req.params.cartID)
        if (cID > 0) {
            await req.gestorCarrito.vaciarCarrito(cID)
            res.status(200).send("Carrito vaciado")
        } else {
            res.status(400).json("Error 400. EL CODIGO INGRESADO NO ES CORRECTO.")
        }
    } catch (error) {
        if (error.message.includes("EL CARRITO NO EXISTE.")) {
            res.status(404).json("Error 404. EL CARRITO NO EXISTE.")
        } else {
            next(error)
        }
    }
})

// POST /api/carts
// Crear carrito con ID autogenerado
router.post("/", async (req, res, next) => {
    try {
        const idCarritoCreado = await req.gestorCarrito.crearCarrito()
        res.status(201).send("Carrito creado correctamente con ID: " + idCarritoCreado)
    } catch (error) {
        next(error)
    }
})

// POST /api/carts/:cid/products/:pid
// Agregar producto al carrito
// Si ya existe, incrementar la cantidad
router.post("/:cartID/products/:productID", async (req, res, next) => {
    try {
        const pID = parseInt(req.params.productID)
        const cID = parseInt(req.params.cartID)
        if (cID > 0 && pID > 0) {
            await req.gestorCarrito.agregarProductoAlCarrito(pID, cID)
            res.status(200).send("Producto Agregado")
        } else {
            res.status(400).json("Error 400. EL CODIGO INGRESADO NO ES CORRECTO.")
        }
    } catch (error) {
        if (error.message.includes("EL CARRITO NO EXISTE.")) {
            res.status(404).json("Error 404. EL CARRITO NO EXISTE.")
        } else {
            next(error)
        }
    }
})

// Esto es para que acepte JSON y Datos de formulario, los que estan arriba no los usan
router.use(json(), urlencoded({extended: true}))

// PUT /api/carts/:cid/products/:pid
// Actualizar únicamente la cantidad de un producto
router.put("/:cartID/products/:productID", async (req, res, next) => {
    try {
        const pID = parseInt(req.params.productID)
        const cID = parseInt(req.params.cartID)
        const cantidad = parseInt(req.body.quantity)
        if (cID > 0 && pID > 0 && !isNaN(cantidad)) {
            await req.gestorCarrito.modificarCantidadDeProductoDelCarrito(pID, cID, cantidad)
            res.status(204).send("Cantidad del Producto Modificada")
        } else {
            res.status(400).json("Error 400. EL CODIGO INGRESADO NO ES CORRECTO.")
        }
    } catch (error) {
        if (error.message.includes("EL CARRITO NO EXISTE.")) {
            res.status(404).json("Error 404. EL CARRITO NO EXISTE.")
        } else {
            next(error)
        }
    }
})

// PUT /api/carts/:cid
// Actualizar todos los productos del carrito
router.put("/:cartID", async (req, res, next) => {
    try {
        const cID = parseInt(req.params.cartID)
        const productos = req.body.products
        if (cID > 0 && productos) {
            await req.gestorCarrito.modificarTodoElCarrito(cID, productos)
            res.status(204).send("Carrito Modificado")
        } else {
            res.status(400).json("Error 400. FORMATO DE ENTRADA INCORRECTO.")
        }
    } catch (error) {
        if (error.message.includes("EL CARRITO NO EXISTE.")) {
            res.status(404).json("Error 404. EL CARRITO NO EXISTE.")
        } else {
            next(error)
        }
    }
})


router.use((err, req, res, next) => {
    res.status(500).json({Error: err.message})
})

export default router