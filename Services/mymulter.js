import multer from "multer"
import { nanoid } from "nanoid"
import path from "path"
import { fileURLToPath } from "url"
import fs from "fs"

export const validationObg = {
image:['image/png','image/jpeg'],
file:['application/pdf']
}
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// export const myMulter = ({
//     customvalidation = validationObg.image,
//     customPath = "general"
// }={})=>{
//     const fullpath =path.join(__dirname,`../uploads/${customPath}`)
//     if(! fs.existsSync(fullpath)){
//        fs.mkdirSync(fullpath,{recursive:true})
//     }
//     const storage = multer.diskStorage({
//         destination:(req,file,cb)=>{
//             cb(null,'uploads')
//         },
//         filename:(req,file,cb)=>{
//             const uniqueName = nanoid() +'__' + file.originalname;
//          cb(null,uniqueName)
//         }
//     })
//     const fileFilter = (req,file,cb)=>{
//      if(customvalidation.includes(file.mimetype)){
//       return  cb(null,true)
//      }
//         cb(new Error('in valid extension',{cause:400}),false)
//     }
//     const upload = multer({fileFilter,storage});
//     return upload;
// }


export const myMulter = ({
        customvalidation = validationObg.image
    }={})=>{
        const storage = multer.diskStorage({ })
        const fileFilter = (req,file,cb)=>{
         if(customvalidation.includes(file.mimetype)){
          return  cb(null,true)
         }
            cb(new Error('in valid extension',{cause:400}),false)
        }
        const upload = multer({fileFilter,storage});
        return upload;
    }