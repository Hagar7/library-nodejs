import jwt from "jsonwebtoken";


export const tokenFun = ({
    payload = {} || "",
    Signutare  = process.env.Token_Signtaure,
    generate = true,
    
}) =>{
    //generate token
    if(typeof payload == "object"){
        if(Object.keys(payload).length && generate){
            const token = jwt.sign(payload,Signutare)
            return token
        }
        return false
    }

    //decode token 

    if(typeof payload == 'string'){
        if (payload == "" && generate) {
            return false;
          }
       const decode = jwt.verify(payload,Signutare)
       return decode
    }

}