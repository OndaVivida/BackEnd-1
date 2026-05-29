import { json, Router, urlencoded } from "express";
import { uploader } from "../utils.js";
import { validadorFormularioProductos } from "../middlewares/validador.Formulario-Productos.js";
import { productModel } from "../models/productModel.js";

const router = Router()

// GET /api/products
// Permite:
// limit (cantidad de resultados), page (pagina), query (filtro por category o status con true, false)
// sort (orden 1 acendente o -1 decendente por precio)
// Con valores por defecto: limit = 10 page = 1
// Si alguna query no es válida simplemente la ignora
router.get("/", async (req, res, next) => {
    try {
        let orden
        let {category, status} = req.query
        const filtros = {}
        const limite = req.query.limit ? parseInt(req.query.limit) : 10
        const pagina = req.query.page ? parseInt(req.query.page) : 1
        const ordenEntrada = parseInt(req.query.sort)
        if (ordenEntrada && (ordenEntrada === 1 || ordenEntrada === -1)) {
            orden = {price : parseInt(req.query.sort)}
        } else {
            orden = {}
        }
        if (category) {
            filtros.category = category
        }
        if (status === "true" || status === "false") {
            filtros.status = status
        }
        const productos = await productModel.paginate(filtros, {
            limit : limite,
            page : pagina,
            sort : orden,
        })
        res.status(200).json(productos)
    } catch (error) {
        next(error)
    }
})

// GET /api/products/:pid
// Obtiene un producto por ID
router.get("/:productID", async (req, res, next) => {
    try {
        const producto = await productModel.findById(req.params.productID)
        producto ? res.status(200).json(producto) : res.status(404).json("Error 404. EL PRODUCTO NO EXISTE.")
    } catch (error) {
        if (error.message.includes("Cast to ObjectId failed")) {
            res.status(400).json("Error 400. Formato de ObjectId Incorrecto")
        } else {
            next(error)
        }
    }
})

// DELETE /api/products/:pid
// Elimina un producto
router.delete("/:productID", async (req, res, next) => {
    try {
        const producto = await productModel.findByIdAndDelete(req.params.productID)
        producto ? res.status(200).json({mensaje : "Producto Eliminado", producto}) : res.status(404).json("Error 404. EL PRODUCTO NO EXISTE.")
        req.io.emit("actualizacionDeApiProducts")
    } catch (error) {
        if (error.message.includes("Cast to ObjectId failed")) {
            res.status(400).json("Error 400. Formato de ObjectId Incorrecto")
        } else {
            next(error)
        }
    }
})

// Esto es para que acepte JSON y Datos de formulario, los que estan arriba no los usan
router.use(json(), urlencoded({extended: true}))

// POST /api/products
// Crea productos con los campos: title, description, code, price, status, stock, category, thumbnails.
// tittle y code son obligatorios, code tiene formato abc123. thumbnails tiene un icon por defecto.
// El ID se genera automáticamente.
router.post("/", uploader.single("thumbnails"), validadorFormularioProductos, async (req, res, next) => {
    try {
        if (req.file) {
            req.body.thumbnails = `/images/${req.file.filename}`
        }
        const producto = await productModel.create(req.body)
        res.status(201).json({mensaje : "Producto creado", producto})
        req.io.emit("actualizacionDeApiProducts")
    } catch (error) {
        if (error.message.includes("duplicate key")) {
            res.status(409).json("Error, el Código ya está en uso.")
        } else if (error.message.includes("validation failed")) {
            res.status(400).json("Error, El código debe tener formato abc123.")
        } else {
            next(error)
        }
    }
})

// PUT /api/products/:pid
// Actualiza un producto existente sin modificar el ID
router.put("/:productID", uploader.single("thumbnails"), validadorFormularioProductos, async (req, res, next) => {
    try {
        if (req.file) {
            req.body.thumbnails = `/images/${req.file.filename}`
        }
        const producto = await productModel.findByIdAndUpdate(req.params.productID, req.body, {returnDocument: "after"})
        producto ? res.status(200).json({mensaje : "Producto Actualizado: ", producto}) : res.status(404).json("Error 404. EL PRODUCTO NO EXISTE.")
        req.io.emit("actualizacionDeApiProducts")
    } catch (error) {
        if (error.message.includes("Cast to ObjectId failed")) {
            res.status(400).json("Error 400. Formato de ObjectId Incorrecto.")
        } else {
            next(error)
        }
    }
})

router.use((err, req, res, next) => {
    console.log(err)
    console.log(err.message)
    res.status(500).json({Error: err.message})
})

export default router