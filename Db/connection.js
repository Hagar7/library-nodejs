import mongoose from "mongoose"



const connectionDB = async()=>{
    return await mongoose.connect(process.env.DB_URL)
    .then((res) => console.log("connection successful"))
    .catch((err) => console.log({message:'connection failed',error:err}));
}


mongoose.set('strictQuery',true);
export default connectionDB;