import fs from "fs/promises"
import { GestorGenerico } from "./GestorGenerico.js"

class GestorCarrito extends GestorGenerico {
    constructor(ruta) {
        super(ruta)
    }

    async obtenerTodosCarritos() {
        try {
            const carritos = await fs.readFile(this.rutaDeArchivo, { encoding: "utf-8" })
            return JSON.parse(carritos)
        } catch (error) {
            throw new Error(`ERROR AL OBTENER TODOS LOS CARRITOS. ${error.message}`)
        }
    }

    async obtenerCarrito(cID, completo = false) {
        try {
            const carritos = await this.obtenerTodosCarritos()
            const carrito = carritos.find((cart) => cart.id === cID)
            if (carrito) {
                if (completo) {
                    return {carrito, carritos}
                }
                return carrito
            }
            throw new Error(`EL CARRITO NO EXISTE.`)
        } catch (error) {
            throw new Error(`ERROR AL OBTENER EL CARRITO. ${error.message}`)
        }
    }

    async crearCarrito() {
        try {
            const carritoCreado = {}
            const carritos = await this.obtenerTodosCarritos()
            carritoCreado.id = carritos.length ? carritos[carritos.length - 1].id + 1 : 1
            carritoCreado.products = []
            carritos.push(carritoCreado)
            await fs.writeFile(this.rutaDeArchivo, JSON.stringify(carritos), {encoding: "utf-8"})
            return carritoCreado.id
        } catch (error) {
            throw new Error(`ERROR AL CREAR EL CARRITO. ${error.message}`)
        }
    }

    async agregarProductoAlCarrito(pID, cID) {
        try {
            const {carrito, carritos} = await this.obtenerCarrito(cID, true)
            const indice = carrito.products.findIndex((products) => products.product === pID)
            if (indice >= 0) {
                carrito.products[indice].quantity += 1
            } else {
                carrito.products.push({
                    product : pID,
                    quantity : 1
                })
            }
            await fs.writeFile(this.rutaDeArchivo, JSON.stringify(carritos), { encoding: "utf-8" })
        } catch (error) {
            throw new Error(`ERROR AL AÑADIR EL PRODUCTO ${pID} AL CARRITO ${cID}. ${error.message}`)
        }
    }

    async modificarCantidadDeProductoDelCarrito(pID, cID, cantidad) {
        try {
            if (cantidad <= 0) {
                await this.eliminarProductoDelCarrito(pID, cID)
            } else {
                const {carrito, carritos} = await this.obtenerCarrito(cID, true)
                const indice = carrito.products.findIndex((products) => products.product === pID)
                if (indice >= 0) {
                    carrito.products[indice].quantity = cantidad
                    await fs.writeFile(this.rutaDeArchivo, JSON.stringify(carritos), { encoding: "utf-8" })
                } else {
                    await this.agregarProductoAlCarrito(pID, cID)
                    await this.modificarCantidadDeProductoDelCarrito(pID, cID, cantidad)
                }
            }
        } catch (error) {
            throw new Error(`ERROR AL MODIFICAR LA CANTIDAD DEL PRODUCTO ${pID} DEL CARRITO ${cID}. ${error.message}`)
        }
    }

    async modificarTodoElCarrito(cID, actualizarProductos) {
        try {
            const {carrito, carritos} = await this.obtenerCarrito(cID, true)
            carrito.products = actualizarProductos
            await fs.writeFile(this.rutaDeArchivo, JSON.stringify(carritos), { encoding: "utf-8" })
        } catch (error) {
            throw new Error(`ERROR AL ACTUALIZAR EL CARRITO ${cID}. ${error.message}`)
        }
    }

    async eliminarProductoDelCarrito(pID, cID) {
        try {
            const {carrito, carritos} = await this.obtenerCarrito(cID, true)
            const indice = carrito.products.findIndex((products) => products.product === pID)
            if (indice >= 0) {
                carrito.products.splice(indice, 1)
                await fs.writeFile(this.rutaDeArchivo, JSON.stringify(carritos), { encoding: "utf-8" })
            } else {
                throw new Error(`EL PRODUCTO NO ESTA EN EL CARRITO.`)
            }
        } catch (error) {
            throw new Error(`ERROR AL ELIMINAR EL PRODUCTO ${pID} DEL CARRITO ${cID}. ${error.message}`)
        }
    }

    async vaciarCarrito(cID) {
        try {
            const {carrito, carritos} = await this.obtenerCarrito(cID, true)
            carrito.products = []
            await fs.writeFile(this.rutaDeArchivo, JSON.stringify(carritos), { encoding: "utf-8" })
        } catch (error) {
            throw new Error(`ERROR AL VACIAR EL CARRITO ${cID}. ${error.message}`)
        }
    }
}
export default new GestorCarrito("carritos.json")