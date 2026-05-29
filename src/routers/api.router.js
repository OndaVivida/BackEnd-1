import { Router } from "express";
import productosRouter from "./productos.router.js"
import carritoRouter from "./carrito.router.js"
import productosRouterFS from "./FileSystem/productos.router.FileSystem.js"
import carritoRouterFS from "./FileSystem/carrito.router.FileSystem.js"

const router = Router()

// implementacion de mongoose
router.use("/products", productosRouter)
router.use("/carts", carritoRouter)

// implementacion de FileSystem
// router.use("/products", productosRouterFS)
// router.use("/carts", carritoRouterFS)

export default router