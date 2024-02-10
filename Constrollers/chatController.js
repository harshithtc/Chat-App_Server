const asyncHandler=require('express-async-handler')
const User=require('../Modals/userModel')
const Chat=require('../Modals/chatModel')

const accessChat=asyncHandler(async(req,res)=>{
    
    const {userId}=req.body
    console.log(`Access chat ${userId}  ,  ${req.user._id}` )
    if(!userId){
        res.send(400)
        throw new Error("User id not sent in request body")
    }
    var isChat=await Chat.find({isGroupChat:false,
        $and:[
                {
                    users:{$elemMatch:{$eq:req.user._id}}
                },
                {
                    users:{$elemMatch:{$eq:userId}}
                }
        ]}
        ).populate("users","-password")
        .populate('latestMessage')
        .populate('time')
        console.log(isChat);

    isChat=await User.populate(isChat,{
        path:"latestMessage.sender",
        select:"name email",
    });

    if(isChat.length>0){
        res.send(isChat[0]);
    }
    else{

        var chatData={
            name:"sender",
            isGroupChat:false,
            users:[req.user._id,userId]
        }


        try{
            const createChat=await Chat.create(chatData)
            const FullChat=await Chat.findOne({_id:createChat._id}).populate(
                "users",
                "-password"
            );
            res.status(200).json(FullChat)
        }
        catch(err){
            res.status(400)
            throw new Error(err.message)
        }
    
    }

   
})

const fetchChats=asyncHandler(async(req,res)=>{
    console.log("fetch chat called")
    try{
        Chat.find({
            users:{$elemMatch:{$eq:req.user._id}}
        }).populate("users","-password")
        .populate("groupAdmin","-password")
        .populate("latestMessage")
        .sort({updatedAt:-1})
        .then(async(results)=>{
            results=await User.populate(results,{
                path:"latestMessage.sender",
                select:"name email"
            })
            res.status(200).send(results)
        })
    }
    catch(err){
        res.status(400)
        throw new Error(err.message)
    }
})

const createGroupChat=asyncHandler(async(req,res)=>{
    console.log(req.body.users,req.body.name)
    if(!req.body.users || !req.body.name)
        return res.status(400).send({message:"Data is insufficient"})

    var users=req.body.users
    console.log("Chat controller create groups: ",req.body)
    try{
        const groupChat= await Chat.create({
            chatName:req.body.name,
            users:users,
            isGroupChat:true,
            groupAdmin:req.user
        });

        const fullGroupChat=await Chat.findOne({
            _id:groupChat._id
        })
        .populate("users","-password")
        .populate("groupAdmin","-password")

        res.status(200).json(fullGroupChat)

    }
    catch(err){
        res.status(400)
        throw new Error(err.message)
    }

})

const fetchGroups=asyncHandler(async(req,res)=>{
    try{
        const allGroups=await Chat.where('isGroupChat').equals(true);
        res.status(200).send(allGroups)
    }
    catch(err){
        res.status(400)
        throw new Error(err.message)
    }
})

const groupExit=asyncHandler(async(req,res)=>{

    const {chatId,userId}=req.body
    const removed=await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull:{users:userId}
        },
        {
            new:true
        }
    )
    .populate("users","-password")
    .populate("groupAdmin","-password")

    if(!removed){
        res.status(400)
        throw new Error("Chat not Found")
    }
    else{
        res.json(removed)
    }
});


const addSelfToGroup=asyncHandler(async(req,res)=>{
       
        const {chatId,userId}=req.body
        console.log(chatId,userId)
        const added=await Chat.findByIdAndUpdate(chatId,
            {
                $push:{users:userId}
            },
            {
                new:true
            }
            )
            .populate('users','-password')
            .populate('groupAdmin','-password')
        if(!added){
            res.status(404)
            throw new Error("Chat not found")
        }else{
            res.json(added)
        }
})


module.exports={
    accessChat,
    fetchChats,
    createGroupChat,
    fetchGroups,
    groupExit,
    addSelfToGroup

}