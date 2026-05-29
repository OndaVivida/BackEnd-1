import { json, Router, urlencoded } from "express";
import { cartModel } from "../models/cartModel.js";
import { productModel } from "../models/productModel.js"
import { Types } from "mongoose"

const router = Router()

// GET /api/carts/:cid
// Lista los productos del carrito con la función populate para traerlos enteros.
router.get("/:cartID", async (req, res, next) => {
    try {
        const carrito = await cartModel.findById(req.params.cartID).populate("products.product")
        carrito ? res.status(200).json(carrito) : res.status(404).json("Error 404. EL CARRITO NO EXISTE.")
    } catch (error) {
        if (error.message.includes("Cast to ObjectId failed")) {
            res.status(400).json("Error 400. FORMATO de ObjectId INCORRECTO.")
        } else {
            next(error)
        }
    }
})

// DELETE /api/carts/:cid/products/:pid
// Elimina un producto del carrito.
router.delete("/:cartID/products/:productID", async (req, res, next) => {
    try {
        const cID = new Types.ObjectId(req.params.cartID)
        const pID = new Types.ObjectId(req.params.productID)
        const producto = await productModel.exists(pID)
        if (producto == null) return res.status(404).json("Error 404. EL PRODUCTO NO EXISTE.")

        const resultado = await cartModel.updateOne({_id: cID},{
            $pull: {
                products: {
                    product: pID
                }
            }
        })
        resultado.matchedCount ? res.status(200).json("Producto eliminado del carrito") : res.status(404).json("Error 404. EL CARRITO NO EXISTE.")
    } catch (error) {
        if (error.message.includes("input must be a 24")) {
            res.status(400).json("Error 400. FORMATO de ObjectId INCORRECTO.")
        } else {
            next(error)
        }
    }
})

// DELETE /api/carts/:cid
// Vacía el carrito completo.
// Si se envía "eliminar=true" como query, elimina directamente el carrito.
router.delete("/:cartID", async (req, res, next) => {
    try {
        const cID = new Types.ObjectId(req.params.cartID)
        if (req.query.eliminar == "true") {
            const respuesta = await cartModel.deleteOne({_id: cID})
            respuesta.deletedCount ? res.status(200).json("Carrito Eliminado") : res.status(404).json("Error 404. EL CARRITO NO EXISTE.")
        } else {
            const respuesta = await cartModel.updateOne({_id: cID}, {products: []})
            respuesta.matchedCount ? res.status(200).json("Carrito vaciado") : res.status(404).json("Error 404. EL CARRITO NO EXISTE.")
        }
    } catch (error) {
        if (error.message.includes("input must be a 24")) {
            res.status(400).json("Error 400. FORMATO de ObjectId INCORRECTO.")
        } else {
            next(error)
        }
    }
})

// POST /api/carts
// Crea un carrito con un ID autogenerado por mongoose.
router.post("/", async (req, res, next) => {
    try {
        const CarritoCreado = await cartModel.create({})
        res.status(201).json({mensaje : "Carrito creado correctamente", id : CarritoCreado._id})
    } catch (error) {
        next(error)
    }
})

// POST /api/carts/:cid/products/:pid
// Agrega un producto al carrito, si este ya existe, incrementa su cantidad.
router.post("/:cartID/products/:productID", async (req, res, next) => {
    try {
        const cID = new Types.ObjectId(req.params.cartID)
        const pID = new Types.ObjectId(req.params.productID)
        const producto = await productModel.exists(pID)
        if (producto == null) return res.status(404).json("Error 404. EL PRODUCTO NO EXISTE.")

        let respuesta = await cartModel.updateOne({_id: cID, "products.product": pID}, {$inc: { "products.$.quantity": 1}})
        if (respuesta.matchedCount == 0) {
            respuesta = await cartModel.updateOne({_id: cID},{
            $push: {
                products: {
                    product: pID,
                    quantity: 1
                }
            }})
        }
        respuesta.matchedCount ? res.status(200).json("Producto Agregado") : res.status(404).json("Error 404. EL CARRITO NO EXISTE.")
    } catch (error) {
        if (error.message.includes("input must be a 24")) {
            res.status(400).json("Error 400. FORMATO de ObjectId INCORRECTO.")
        } else {
            next(error)
        }
    }
})

// PUT /api/carts/:cid/products/:pid
// Actualiza únicamente la cantidad de un producto, no elimina ni agrega.
// La cantidad se agrega mediante query con nombre quantity=
// Si el producto no existe o la cantidad es 0 o menor, rechaza la operación.
router.put("/:cartID/products/:productID", async (req, res, next) => {
    try {
        const cID = new Types.ObjectId(req.params.cartID)
        const pID = new Types.ObjectId(req.params.productID)
        const cantidad = parseInt(req.query.quantity)
        if (cantidad <= 0) 
            return res.status(400).json("Error. LA CANTIDAD DEBE SER MAYOR A 0 (CERO).")
        
        const carritoExiste = await cartModel.exists({_id: cID})
        if (!carritoExiste) 
            return res.status(404).json("Error 404. EL CARRITO NO EXISTE.")

        const respuesta = await cartModel.updateOne({_id: cID, "products.product": pID}, {$set: {"products.$.quantity": cantidad}})
        if (respuesta.matchedCount) {
            res.status(200).json("Cantidad del Producto Modificado")
        } else {
            res.status(404).json("El Producto no está en el carrito")
        }
    } catch (error) {
        const err = ["input must be a 24", "Cast to Number failed"]
        if (err.some((errores) => error.message.includes(errores))) {
            res.status(400).json("Error 400. PARAMETRO INCORRECTO.")
        } else {
            next(error)
        }
    }
})

// Esto es para que acepte JSON y Datos de formulario, los que estan arriba no los usan
router.use(json(), urlencoded({extended: true}))

// PUT /api/carts/:cid
// Actualiza todos los productos del carrito a partir de un array de objetos ingresado por el body.
// No comprueba si los productos existen no esta pensado para uso comun
// Formato del array [{_id: ..., "quantity": 1}, {_id: ..., ...}, ...]
router.put("/:cartID", async (req, res, next) => {
    try {
        const cID = new Types.ObjectId(req.params.cartID)
        if (Array.isArray(req.body)) {
            const respuesta = await cartModel.updateOne({_id: cID}, {$set: {"products": req.body}})
            return respuesta.matchedCount ? res.status(200).json("Carrito Actualizado") : res.status(404).json("Error 404. EL CARRITO NO EXISTE.")
        }
        res.status(400).json("Error 400. SE DEBE INGRESAR UN ARRAY")
    } catch (error) {
        if (error.message.includes("input must be a 24")) {
            res.status(400).json("Error 400. PARAMETRO INCORRECTO.")
        } else if (error.message.includes("Cast to embedded failed")) {
            res.status(400).json("Error 400. EL CARRITO TIENE UN FORMATO INCORRECTO.")
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