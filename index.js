const express = require('express');
const app = express();
const dotenv = require('dotenv');
const { default:mongoose } = require('mongoose');
const userRouter=require('./Routes/userRoutes')
const chatRouter=require('./Routes/chatRoutes')
const messageRouter=require('./Routes/messageRouter')
const cors=require('cors')
app.use(cors())
app.use(express.json())
dotenv.config()


const connectDb=async ()=>{
    try{
        const connect=await mongoose.connect(process.env.MONGO_URI)
        console.log("Server is connected to mongodb Atlas")
    }
    catch(err){
        console.log("Server is not connected to mongodb Atlas  ",err.message)
    }
    
}
connectDb()
app.use('/user',userRouter)
app.use('/chat',chatRouter)
app.use('/message',messageRouter)



const PORT = process.env.PORT || 5000
app.listen(PORT, console.log("Server running in port 5000"))