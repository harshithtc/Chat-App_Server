const express=require('express')
const Router=express.Router()
const {loginController,registerController, fetchAllUsersController}=require("../Constrollers/userController")

Router.post('/login',loginController)
Router.post('/register',registerController)
Router.get('/fethUsers',fetchAllUsersController)

module.exports=Router