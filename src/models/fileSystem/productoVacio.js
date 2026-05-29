export class ProductoVacio {
    constructor(){
        this.title = "Sin Titulo"
        this.description = "Sin Descripcion"
        this.price = "Sin Precio" // numero
        this.category = "Sin Categoria"
        this.stock = 0
        this.status = false
        this.code = "err404"
        this.thumbnails = [`icon/LC 256.png`]
    }
}