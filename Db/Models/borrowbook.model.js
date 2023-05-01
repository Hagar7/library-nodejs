import mongoose, { Schema } from "mongoose";

const borrowBookSchema = new Schema({

    returnDate:{
        type:Date
    },
    takenBy:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    issuedBook:{
        type:Schema.Types.ObjectId,
        ref:'Book'
    } 
},{
    timestamps:true
})

const borrowModel = mongoose.model('Borrow',borrowBookSchema)

export default borrowModel;