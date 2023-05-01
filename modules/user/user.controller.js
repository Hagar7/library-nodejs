import bcript from "bcryptjs";
import userModel from "../../Db/Models/user.model.js";
import { sendEmail } from "../../Services/SendEmail.js";
import { tokenFun } from "../../Utils/token.js";
import { nanoid } from "nanoid";
import cloudinary from "../../Utils/cloudinary.js";
import { response } from "express";

export const signup = async (req, res, next) => {
  const { name, email, password, phoneNumber } = req.body;
  const hashedpassword = bcript.hashSync(password,+process.env.SALT_ROUNDS);
  const newUser = new userModel({ name, email,phoneNumber,password: hashedpassword });

  const token = tokenFun({ payload: { _id: newUser._id } });
  const confirmationLink = `${req.protocol}://${req.headers.host}/user/confirmationEmail/${token}`;

  const sentEmail = await sendEmail({
    to: newUser.email,
    subject: "confirmation email",
    message: `<a href=${confirmationLink}>Confirm</a>`,
  });
  if (sentEmail) {
    const saveUser = await newUser.save();
    res.status(201).json({ message: "User saved successfully", saveUser });
  } else {
    next(Error("user saved failed", { cause: 406 }));
  }
};

export const confirmEmail = async(req,res,next)=>{
 const {token} = req.params;
 const decode = tokenFun({payload:token,generate:false})
 if(decode?._id){
const user =  await userModel.findOneAndUpdate({_id:decode._id,confirmed:false},{confirmed:true})
if(!user){
  res.status(200).json({message:"already confirmed"})
}else{
 res.status(200).json({message:"confirmation successfully, try to login"})
}
 }else{
   next(Error("please confirm your account"))
 }
}

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  const findUser = await userModel.findOne({ email:email});
  if (findUser) {
    if(findUser.confirmed == true){
      if (!findUser.login) {
        const passMatch = bcript.compareSync(password, findUser.password);
        if (passMatch) {
          const logUser = await userModel.updateOne({ email }, { login: true });
          const token = tokenFun({
            payload: {
              _id: findUser._id,
              email: findUser.email,
              name: findUser.name,
            },
          });
          res.json({ message: "login success", token });
        } else {
          next(Error("Invalid password", { cause: 406 }));
        }
      } else {
        next(Error("you already logged in", { cause: 401 }));
      }

    }else{
      next(Error("please confirm your acount"))
    }
  } else {
    next(newError("user email not found please sign up", { cause: 406 }));
  }
};

export const logOut = async (req, res, next) => {
  const { login, email } = req.user;
  if (login) {
    const logUser = await userModel.updateOne({ email }, { login: false });
    res.json({ message: "user logout succfully" });
  } else {
    next(Error("please login first"), { cause: 400 });
  }
};

export const forgetPass = async (req, res, next) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });
  if (user) {
    const generatecode = nanoid();
    const userCode = await userModel.updateOne(
      { email },
      { code: generatecode }
    );
    const emailSend = await sendEmail({
      to: user.email,
      subject: "change password",
      message: `<p>${generatecode}</p>`,
    });
    res.json({ message: "email send success" });
  } else {
    next(Error("no email found"));
  }
};

export const changepassCode = async (req, res, next) => {
  const { code, email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (user) {
    if (user?.code == code) {
      const hashedpassword = bcript.hashSync(
        password,
        +process.env.SALT_ROUNDS
      );
      const changepass = await userModel.updateOne(
        { email },
        { password: hashedpassword }
      );
      res.json({ message: "password change successfuly", changepass });
    } else {
      next(Error("code is not valid"), { cause: 500 });
    }
  } else {
    next(Error("email is not valid"), { cause: 500 });
  }
};


export const deleteUser = async(req,res,next)=>{
  const {_id} = req.user;
  const user = await userModel.findByIdAndDelete(_id)
  if (user) {
    res.json({ message: "User Deleted successfuly", user });
  } else {
    next(Error("User Deleted failed",{cause:500}))
  }

}


export const updateUser = async(req,res,next)=>{
  const {_id} = req.user;
  const {name,phoneNumber} = req.body;
  const user = await userModel.findByIdAndUpdate({ _id },{
    $set:{
      name,
      phoneNumber,
    },
    
  },{new:true})
  if (user) {
    res.json({ message: "User updated successfuly", user });
  } else {
    next(Error("User updated failed",{cause:500}))
  }
}



export const softDeletedUser= async(req,res,next)=>{
  const {_id} = req.user;
  const user = await userModel.findByIdAndUpdate({_id},{softDeleted:true})
  if(user){
    res.json({ message: "User inactive successfuly", user})
  }else{
    next(Error("there is no user",{cause:500}))
  }
}


export const chnageUserPass = async(req,res,next)=>{
const {_id} = req.user
const {password,newpass} = req.body
const user = await userModel.findOne({_id})
const passMatch = bcript.compareSync(password, user.password);
if(passMatch){
  const hashedpassword = bcript.hashSync(newpass,+process.env.SALT_ROUNDS);
  const updatepass = await userModel.updateOne({_id},{password:hashedpassword})
res.json({message:"password change successful"})
}else{
  next(Error("old password wrong"))
}
}


export const userProfile = async(req,res,next)=>{
  if(!req.file){
    next(Error("please select profile picture",{cause:400}))
  }
  const {name,_id} = req.user
  const {secure_url} =await cloudinary.uploader.upload(req.file.path,{
    folder:`Images/${name}/profile`
  })
  const user = await userModel.findByIdAndUpdate({_id},{
    profilePic:secure_url
  })
  if(user){
   res.json({message:"profile updated"})
  }else{
    next(Error("please login",{cause:400}))
  }
}