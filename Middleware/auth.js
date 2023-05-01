import userModel from "../Db/Models/user.model.js";
import { tokenFun } from "../Utils/token.js";


export const auth  = () => {
    return async(req,res,next)=>{
        try {
            const {authorization} = req.headers
            if(!authorization){
                return res.json({ message: "you must be logged in" });
            }
            if(!authorization.startsWith(process.env.Token_Prefix)){
                return res.json({ message: "Invalid authorization" });
            }
            const token = authorization.split(process.env.Token_Prefix)[1]
            const decode = tokenFun({ payload: token })
            if(!decode || !decode._id){
                return res.json({ message: "Invalid token" });
            }
            const user = await userModel.findById(decode._id)
            if(user){
                req.user = user;
                next();
            }else{
                res.json({ message: "Invalid User" });
            }
            
        } catch (error) {
            console.log(error);
            res.json({ message: "catch error" });
        }
    }
}