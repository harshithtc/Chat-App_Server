const express = require('express');
const app = express();
const dotenv = require('dotenv');
const { default: mongoose } = require('mongoose');
const userRouter = require('./Routes/userRoutes')
const chatRouter = require('./Routes/chatRoutes')
const messageRouter = require('./Routes/messageRouter')
const { Server } = require("socket.io");
const cors = require('cors')
app.use(cors())
app.use(express.json())
dotenv.config()


const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI)
    console.log("Server is connected to mongodb Atlas")
  }
  catch (err) {
    console.log("Server is not connected to mongodb Atlas  ", err.message)
  }

}
connectDb()
app.use('/user', userRouter)
app.use('/chat', chatRouter)
app.use('/message', messageRouter)
const PORT = process.env.PORT || 5000
const server = app.listen(PORT, console.log("Server running in port 5000"))
//socket.io connection
const io = new Server(server, {
  cors: {
    origin: "*"
  },
  pingTimeout: 60000,
});

io.on("connection", (socket) => {
  console.log("a user connected")

  socket.on("setup", (user) => {
    socket.join(user._id);
    console.log(user._id + ' joined the room');
    socket.emit("connected")
  })


  socket.on("join chat", (room) => {
    console.log("join chat",room)
    socket.join(room)
  })

  socket.on("new message", (newMessageStatus) => {
    var chat = newMessageStatus.chat;
    if (!chat.users) {
      return console.log("Chat.users not defined")
    }
    console.log("new message called")
    chat.users.forEach((user) => {
      socket.in(user._id).emit("message recieved", newMessageStatus)
    })
  })

});
