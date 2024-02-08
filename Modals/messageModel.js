const mongoose = require('mongoose')
const messageModal = mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content:{
        type:String,
        trim:true,
    },
    reciever: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
    },
    time:{ type: Date, 
        default: Date.now
    },
}, {
    timeStamp: true
})
const Message = mongoose.model("Message", messageModal)
module.exports = Message