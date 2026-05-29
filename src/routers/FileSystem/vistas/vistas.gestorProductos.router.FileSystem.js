import { Router } from "express";
import GestorProductos from "../../../dao/GestorProductos.js";

const router = Router()

router.get("/", async (req, res) => {
    res.render("menu-gestor-productos", {
        title : "Menu Gestor",
        estilo: ["/css/estiloGestorProductos.css"]
    })
})

router.get("/crear-producto", async (req, res) => {
    res.render("crear-producto", {
        title : "Crear Producto",
        estilo: ["/css/estiloGestorProductos.css"],
        script: ["/socket.io/socket.io.js", "/js/crear-producto.js"]
    })
})

router.get("/editar-producto", async (req, res) => {
    res.render("editar-producto", {
        title : "Editar Producto",
        estilo: ["/css/estiloGestorProductos.css"],
        script: ["/socket.io/socket.io.js", "/js/editar-producto.js"]
    })
})

router.get("/borrar-producto", async (req, res) => {
    res.render("borrar-producto", {
        title : "Borrar Producto",
        estilo: ["/css/estiloGestorProductos.css"],
        script: ["/socket.io/socket.io.js", "/js/borrar-producto.js"]
    })
})

export default router