const express = require('express')
const userRoute = express()
const userModel = require('../models/userModel.js')

userRoute.get('/users',async (req,res)=>{
    try {
        const users = await userModel.find()
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
})

userRoute.post('/register',async (req,res)=>{
    try {
        const userData = req.body
        await userModel.create(userData)
        res.status(200).json(userData)
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
})

module.exports = userRoute