import express from "express"
import { engine } from "express-handlebars"
import { Server } from "socket.io"
import { __dirname } from "./utils.js"
import apiRouter from "./routers/api.router.js"
import vistasRouter from "./routers/vistas.router.js"
import mongoose from "mongoose"

const app = express()
const puerto = 8080

const httpServer = app.listen(puerto, () => {
    console.log(`Servidor iniciado en http://localhost:${puerto}`)
    mongoose
        .connect("mongodb+srv://defecto_db_user:6vA1NPjMLQ4v6XFI@claster0011.x3mmzkg.mongodb.net/ecommerce")
        .then(() => console.log("Conectado a la Base de datos"))
        .catch((err) => console.log("Error al conectar a la Base de Datos", err))
})

const serverSocket = new Server(httpServer)

serverSocket.on("connection", (clientSocket) => {
    console.log("Usuario Conectado", clientSocket.id)
    clientSocket.on("creacionProducto", (prod) => {
        const producto = prod.producto
        serverSocket.emit("actualizarVisualizacion", {producto, operacion : "Creado"})
    })
    clientSocket.on("actualizacionProducto", (prod) => {
        const producto = prod.producto
        serverSocket.emit("actualizarVisualizacion", {producto, operacion : "Actualizado"})
    })
    clientSocket.on("eliminacionProducto", (prod) => {
        const producto = prod.producto
        serverSocket.emit("actualizarVisualizacion", {producto, operacion : "Eliminado"})
    })
    clientSocket.on("error", (err) => {
        clientSocket.emit("errorProd", err)
    })
})

app.use((req, res, next) => {
    req.io = serverSocket
    next()
})

app.use(express.static(__dirname + "/public"))

app.set("view engine", "handlebars")

app.engine("handlebars", engine({
    extname: ".handlebars",
    partialsDir: __dirname + "/vistas/partials",
    helpers: { 
       eq: (a, b) => a == b,
       multiplicar: (a, b) => a * b,
    },
}))

app.set("views", __dirname + "/vistas")

app.use("/api", apiRouter)
app.use("/", vistasRouter)

app.use((err, req, res, next) => {
    console.log(err)
    console.log(err.message)
    res.status(500).json({Error: err.message})
})