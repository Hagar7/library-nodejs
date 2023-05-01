import { config } from 'dotenv';
import { stackVar } from './Utils/errorHandling.js';
import express from 'express';
import connectionDB from './Db/connection.js';
import * as allRouter from './modules/index.routes.js'
  const app = express();
  const port  = 5000


config({ path: "./Db/.env" });
app.use(express.json())
connectionDB()

app.use('/user',allRouter.userRouter)
app.use('/book',allRouter.bookRouter)


app.use((err,req,res,next)=>{
if(err){
  console.log(err);
  res.status(err['cause'] || 500).json({
    message:"catch error",
    err: err.message,
    stack: err.stack,
    stackVar:stackVar
  })
}
})


app.listen(port,()=>{
    console.log('server is running..............');
})