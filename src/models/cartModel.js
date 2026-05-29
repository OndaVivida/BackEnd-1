import {Schema, model, Types} from "mongoose"

const cartSchema = new Schema({
    products : {
        type : [{
            product : {
                type : Types.ObjectId,
                ref : "products"
            },
            quantity : {
                type : Number,
                default : 1
            }
        }],
        default : []
    }
}, { versionKey: false })

export const cartModel = model("carts", cartSchema)