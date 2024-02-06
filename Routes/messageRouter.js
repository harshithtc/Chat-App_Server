const express=require("express")
const Router=express.Router()
const {protect}=require('../middleware/authMiddleware')

const {allMesages,sendMessages}=require('../Constrollers/messageController')


Router.route("/:chatId").get(protect,allMesages)
Router.route("/").post(protect,sendMessages)

module.exports =Router;
