import {fileURLToPath} from "url"
import {dirname} from "path"
import multer from "multer"

const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + "/public/images")
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
    }
})

export const uploader = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const extensionValida = [".png", ".jpg", ".jpeg", ".webp"]
        if (file.mimetype.startsWith("image/") && extensionValida.some(ext => file.originalname.endsWith(ext))) {
            cb(null, true)
        } else {
            cb(new Error("Tipo de archivo inválido"), false)
        }
    },
    limits: {
        fileSize: 2621440
    }
})