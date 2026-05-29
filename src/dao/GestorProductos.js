import fs from "fs/promises"
import { GestorGenerico } from "./gestorGenerico.js"
import { ProductoVacio } from "../models/fileSystem/productoVacio.js"

class GestorProductos extends GestorGenerico {
    constructor(ruta) {
        super(ruta)
    }

    async obtenerTodosProductos() {
        try {
            const productos = await fs.readFile(this.rutaDeArchivo, {encoding: "utf-8"})
            return JSON.parse(productos)
        } catch (error) {
            throw new Error(`ERROR AL OBTENER LOS PRODUCTOS. ${error.message}`)
        }
    }

    async obtenerProductoPorID(productoID) {
        try {
            const productos = await this.obtenerTodosProductos()
            return productos.find((producto) => producto.id == productoID)
        } catch (error) {
            throw new Error(`ERROR AL OBTENER UN PRODUCTO POR ID. ${error.message}`)
        }
    }

    async crearProducto(producto) {
        try {
            producto = {...new ProductoVacio, ...producto}
            const productos = await this.obtenerTodosProductos()
            producto.id = productos.length ? productos[productos.length - 1].id + 1 : 1
            productos.push(producto)
            await fs.writeFile(this.rutaDeArchivo, JSON.stringify(productos), {encoding: "utf-8"})
        } catch (error) {
            throw new Error(`ERROR AL CREAR EL PRODUCTO. ${error.message}`)
        }
    }

    async actualizarProductoPorID(productoID, datos) {
        try {
            const productos = await this.obtenerTodosProductos()
            let productoIndice = productos.findIndex((producto) => producto.id == productoID)
            productos[productoIndice] = {...productos[productoIndice], ...datos}
            await fs.writeFile(this.rutaDeArchivo, JSON.stringify(productos), {encoding: "utf-8"})
        } catch (error) {
            throw new Error(`ERROR AL ACTUALIZAR EL PRODUCTO. ${error.message}`)
        }
    }

    async eliminarProductoPorID(productoID) {
        try {
            const productos = await this.obtenerTodosProductos()
            const indice = productos.indexOf((producto) => producto.id === productoID)
            productos.splice(indice, 1)
            await fs.writeFile(this.rutaDeArchivo, JSON.stringify(productos), {encoding: "utf-8"})
        } catch (error) {
            throw new Error(`ERROR AL ELIMINAR EL PRODUCTO. ${error.message}`)
        }
    }
}
export default new GestorProductos("productos.json")