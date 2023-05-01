import moment from 'moment';
import bookModel from "../../Db/Models/book.model.js";
import borrowModel from "../../Db/Models/borrowbook.model.js";
import userModel from "../../Db/Models/user.model.js";
import cloudinary from '../../Utils/cloudinary.js';


export const addBook = async (req, res, next) => {
  const { name, price } = req.body;
  const book = new bookModel({ name, price });
  const savedBook = await book.save();
  if (savedBook) {
    res
      .status(201)
      .json({ message: "book saved successfully", book: savedBook });
  } else {
    next(Error("book saved failed", { cause: 406 }));
  }
};

export const getBook = async (req, res, next) => {
  const books = await bookModel.find();
  if (books.length) {
    res.status(200).json({ message: "done", books });
  } else {
    next(Error("there is no book found", { cause: 500 }));
  }
};

export const addBookBorrow = async(req,res,next)=>{
  const {bookId,days} = req.body
  const {_id} = req.user;
  const book = await bookModel.findByIdAndUpdate({_id:bookId},{Borrowed:true})
  console.log(book);
  if(book){
    
  const addBook = new borrowModel({issuedBook:bookId,takenBy:_id,})
  const saveBook =await addBook.save()
  if(saveBook){
    const dataReturn= moment(saveBook.createdAt).add(`${days}`, 'days')
    const newBook = await borrowModel.updateOne({_id:saveBook._id},{returnDate:dataReturn})
       res.json({message:"done",newBook})
  }else{
    next(Error("book added failed", { cause: 500 }));
  }
  }else{
    next(Error("there is no book found", { cause: 500 }));
  }
}

export const searchBorrowBooks = async (req, res, next) => {
  const { name } = req.body;
  const book = await bookModel.findOne({
    Borrowed: true,
    name: { $regex: `^${name}` },
  });
  if (book) {
    res.status(200).json({ message: "done", book });
  } else {
    next(Error("there is no book", { cause: 500 }));
  }
};


export const getBorrowDetails = async(req,res,next)=>{

  const books = await borrowModel.find({}).populate([
    {
      path: "issuedBook",
      select: ["name", "price"],
    },{
      path:"takenBy",
      select:["name","email"]
    }
  ]);
  if(books.length){
    res.json({message:"done",books})
  }else{
    next(Error("there is no books found", { cause: 500 }));

  }
}



export const notreturned = async(req,res,next)=>{
const {takenBy} = req.body
  const book = await borrowModel.findOne({_id:takenBy})
  if(book){
const issDate =moment(book.createdAt)
const retDate = moment(book.returnDate)
const lateDate = issDate.diff(retDate, 'days')
if(lateDate > 0){
   const delayCharge = 20;
   const fine = lateDate * delayCharge;
  res.json({message:"book not returned in returned date",late:lateDate,fine})
}else{
res.json({message:"date to return book is",retDate})
}
   }else{
    next(Error("there is no borrow books found"));
   }
}



export const bookPicture = async(req,res,next)=>{
  if(!req.file){
    next(Error("please select book picture",{cause:400}))
  }
  const {name,_id} = req.body;
  const {secure_url} =await cloudinary.uploader.upload(req.file.path,{
    folder:`Books/${name}/Cover`
  })
  const book = await bookModel.findByIdAndUpdate(_id,{
    bookpic:secure_url
  })
  if(book){
   res.json({message:"picture updated"})
  }else{
    next(Error("there is no book",{cause:400}))
  }
}