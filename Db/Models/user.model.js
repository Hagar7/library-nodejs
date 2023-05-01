import mongoose, { model, Schema } from "mongoose";




const userSchema = new Schema({
    name:{
        type:String,
        required: true,
    },
    email:{
        type:String,
        unique: true,
    },
    phoneNumber:{
      type: Number
    },
    password:String,
    login: {
        type: Boolean,
        default: false,
        required: true,
      },
      code:{
        type:String,
        default:''
      },
      profilePic:{
      type: String,
      },
      confirmed: {
        type: Boolean,
        default: false,
      },
      softDeleted: {
        type: Boolean,
        default: false,
      },

},{
    timestamps:true,
});

const userModel = mongoose.model("User", userSchema);


export default userModel;