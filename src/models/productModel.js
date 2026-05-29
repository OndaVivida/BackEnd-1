import {Schema, model} from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

const productSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        default : "Sin Descripcion",
    },
    price : {
        type : Number,
        default : null,
    },
    category : {
        type : String,
        default : "Sin Categoria",
        index : true
    },
    stock : {
        type : Number,
        default : 0
    },
    status : {
        type : Boolean,
        default : false,
        index : true
    },
    code : {
        type : String,
        required : true,
        unique : true,
        match : [
            /^[a-zA-Z]{3}\d{3}$/,
            "El código debe tener formato abc123"
        ]
    },
    thumbnails : {
        type : String,
        default : `/icon/LC 128.png`
    }
})
productSchema.plugin(mongoosePaginate)

export const productModel = model("products", productSchema)