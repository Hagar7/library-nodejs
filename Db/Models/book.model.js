import mongoose, { Schema } from "mongoose";



const bookSchema = new Schema({
    name:{
        type:String,
        required: true,
    },
    price:Number,
    Borrowed:{
        type:Boolean,
        default:false
    },
    bookpic:String,
},{
timestamps:true
})


const bookModel = mongoose.model('Book',bookSchema)


export default bookModel;