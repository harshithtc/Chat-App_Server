const asyncHandler=require('express-async-handler')
const Message=require('../Modals/messageModel')
const User=require('../Modals/userModel')
const Chat =require('../Modals/chatModel');
const { response } = require('express');
const allMesages=asyncHandler(async(req,res)=>{
    console.log("all message")
    try{
            let messages=await Message.find({chat:req.params.chatId})
            .populate('sender','name email')
            .populate('reciever')
            .populate('chat')
            res.json(messages)
    }
    catch(err){
        res.status(400)
        throw new Error(err.message)
    }
});

const sendMessages=asyncHandler(async(req,res)=>{
    console.log("Send message")
    const {content,chatId}=req.body
    if(!content || !chatId){
       return res.status(400)
    }
    var newMessage={
        sender:req.user._id,
        content:content,
        chat:chatId,
    }
    try{
        let message = await Message.create(newMessage);
        console.log(message)
        message=await  message.populate('sender','name')
        message=await  message.populate('chat')
        message=await  message.populate('reciever')
        message=await  User.populate(message,{
            path:'chat.users',  
            select:'name email'
        })
        await Chat.findByIdAndUpdate(req.body.chatId,{latestMessage:message,time:new Date()})
        res.json(message)
    }
    catch(err){
        res.status(400)
        throw new Error(err.message)
    }
    

})

const deleteMessages=asyncHandler(async(req,res)=>{
    console.log("delete message called")
    Message.deleteMany({chat:req.body.chatId}).then((response)=>{
        res.send("Deleted all messages in this chat!")
    }).catch((err)=>{
        res.status(400)
        return new Error("Error occured")
    })
    
})

module.exports={
    allMesages,
    sendMessages,
    deleteMessages,
}