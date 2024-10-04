const express = require('express')
const userRoute = express()
const userModel = require('../models/userModel.js')
const bcrypt = require('bcryptjs')
const token = require('jsonwebtoken')

userRoute.get('/users',async (req,res)=>{
    try {
        const users = await userModel.find()
        res.status(200).json(users)
    } catch (error) {
        console.log("Dans userRoute.get: ",error.message)
        res.status(500).json({message:error.message})
    }
})

userRoute.post('/register',async (req,res)=>{
    const userData = req.body
    try {
        const email = userData.email // Email écrit dans req.body
        const email_Exists = await userModel.findOne({email})
        if(email_Exists){           // TRUE, si l'email est déjà dans la Base de données
            return res.status(400).json(`Email "${email}" déjà utilisé`)
        }
        // Crypting settings
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(userData.password,salt)
        // Makes the password in req.body, Hashed aka Crypted
        userData.password = hash
        // POST les données écrite dans le req.body
        await userModel.create(userData)
        res.status(200).json({message:`L'utilisateur "${userData.username}" à été ajouté avec succes !`})
    } catch (error) {
        console.log("Dans userRoute.post: ",error.message);
        res.status(500).json({message:error.message})
    }
})

userRoute.post('/login', async (req,res)=>{
    try {
        const {email,password} = req.body // Email and Pswd de req.body
        const user = await userModel.findOne({email}) // Trouve le User dans la BDD grace à l'Email
        if(user){
            const isMatch = bcrypt.compareSync(password,user.password)
            if(isMatch){
                const tokenSigned = token.sign({power:user.role},process.env.Secret)
                res.status(200).cookie('token',tokenSigned,{
                    httpOnly:true,
                    secure:false,       // When not using HTTPS
                    sameSite:"None"
                }).json({message:'Connexion réussie',tokenSigned,role:user.role})
            } else {
                // If isMatch(password) doesn't match, return an error response
                return res.status(401).json({ message: 'Mot de passe Incorrect' });
            }
        } else {
            // If user is not found, return this error
            return res.status(404).json({ message: 'User pas Trouvé' });
        }
    } catch (error) {
        console.log("Dans userRoute.post: ",error.message);
        res.status(500).json({message:error.message})
    }
})

module.exports = userRoute