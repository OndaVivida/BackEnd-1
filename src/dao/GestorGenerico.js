import fs from "fs"
import {__dirname} from "../utils.js"

export class GestorGenerico {
    constructor(ruta) {
        this.rutaDeArchivo = `${__dirname}/dao/data/${ruta}`
        if (!fs.existsSync(this.rutaDeArchivo)) {
            fs.mkdir(`${__dirname}/dao/data`, () => {
                fs.writeFileSync(this.rutaDeArchivo, JSON.stringify([]), {encoding: "utf-8"})
            })
        }
    }
}