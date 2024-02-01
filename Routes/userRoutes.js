const express=require('express')
const Router=express.Router()
const {loginController,registerController, fetchAllUsersController}=require("../Constrollers/userController")
const {protect}=require('../middleware/authMiddleware')
Router.post('/login',loginController)
Router.post('/register',registerController)
Router.get('/fethUsers',protect,fetchAllUsersController)

module.exports=Router