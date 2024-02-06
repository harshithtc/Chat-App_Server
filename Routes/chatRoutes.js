const express=require('express')
const Router=express.Router()
const {protect}=require('../middleware/authMiddleware')
const {
    fetchChats,
    accessChat,
    createGroupChat,
    fetchGroups,
    groupExit,
    addSelfToGroup

}=require('../Constrollers/chatController')

Router.post('/',protect,accessChat)
Router.get('/',protect,fetchChats)
Router.post('/createGroup',protect,createGroupChat)
Router.get('/fetchGroups',protect,fetchGroups)
Router.put('/groupExit',protect,groupExit)
Router.put('/addSelfToGroup',protect,addSelfToGroup)

module.exports=Router