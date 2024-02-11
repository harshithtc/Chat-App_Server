const express=require('express')
const Router=express.Router()
const {loginController,registerController, fetchAllUsersController,searchUser}=require("../Constrollers/userController")
const {protect}=require('../middleware/authMiddleware')
Router.post('/login',loginController)
Router.post('/register',registerController)
Router.get('/fethUsers',protect,fetchAllUsersController)
Router.get('/SearchUser/:searchText',protect,searchUser)

module.exports=Router