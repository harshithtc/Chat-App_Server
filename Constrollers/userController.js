const express = require("express")
const userModel = require("../Modals/userModel")
const expressAsyncHandler = require("express-async-handler")
const generateAuthToken = require("../config/generateToken")
const loginController = expressAsyncHandler(async (req, res) => {
    const { name, password } = req.body;
    const user = await userModel.findOne({ name })
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateAuthToken(user._id),
        })
    } else {
        throw new Error("Invalid User Name or Password")
    }

})

const registerController = expressAsyncHandler(async (req, res) => {
    console.log(req.body)
    const { name, email, password } = req.body;


    //check for all fields
    if (!name || !email || !password) {
        res.sendStatus(400)
        throw new Error("All necessary fields have not been filled")
    }

    //pre existing user
    const userExist = await userModel.findOne({ email })
    if (userExist) {
        throw new Error("User already exist")
    }

    //user name already taken
    const userNameExist = await userModel.findOne({ name })
    if (userNameExist) {
        throw new Error("User name already taken")
    }

    //create entry in the database 
    const user = await userModel.create({ name, email, password })
    if (user) {
        console.log(user)
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateAuthToken(user._id),

        })
    }
    else {
        res.status(400)
        throw new Error("Registration Error")
    }
}
)
const fetchAllUsersController = expressAsyncHandler(async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } }
        ],
    }
        : {};

    const users = await userModel.find(keyword).find({ _id: { $ne: req.user._id } }).select('-password')
    res.send(users)
    console.log(users)

})

const searchUser=expressAsyncHandler(async(req,res)=>{
    const text=req.params.searchText
    console.log("Search called" ,text)
    const users=await userModel.find({name:{$regex:name,$options:'i'}}).select('-password')
    res.json(users)
})

module.exports = {
    loginController,
    registerController,
    fetchAllUsersController,
    searchUser
}