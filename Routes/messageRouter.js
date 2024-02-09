const express=require("express")
const Router=express.Router()
const {protect}=require('../middleware/authMiddleware')

const {allMesages,sendMessages,deleteMessages}=require('../Constrollers/messageController')


Router.route("/:chatId").get(protect,allMesages)
Router.route("/").post(protect,sendMessages)
Router.route("/deleteMessages").post(protect,deleteMessages)

module.exports =Router;
