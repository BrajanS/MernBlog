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
    console.log("Req.cookies.token Acquired: ",req.cookies);
    
    const hasToken = req.cookies.token
    if(!hasToken){
        return res.status(401).json({message:"Vous n'êtes pas autorisé"})
    }
    const isVerified = token.verify(hasToken,process.env.Secret)
    console.log(isVerified);
    
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
                const tokenSigned = token.sign({ID:user._id,ROLE:user.role},process.env.Secret)
                res.status(200).cookie('token',tokenSigned,{
                    httpOnly:true,
                    secure:false,       // When not using HTTPS
                    sameSite:"None",
                    maxAge:60*60*1000   // Life duration of Cookie
                }).json({message:'Connexion réussie',tokenSigned,ID:user._id,ROLE:user.role})
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

userRoute.delete('/user/:id', async (req, res) => {   // Donne le ID and le Token (dans Bearer) pour le supprimer
    const hasToken = req.cookies.token;
    if (!hasToken) {
        return res.status(401).json({ message: 'Vous n\'êtes pas autorisé' });
    }
    try {
        const decoded = token.verify(hasToken, process.env.Secret);
        const userId = req.params.id;
        const userToDelete = await userModel.findById(userId);
        if (!userToDelete) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        await userModel.findByIdAndDelete(userId);
        res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
        console.log("Dans userRoute.delete: ", error.message);
        res.status(500).json({ message: error.message });
    }
});

userRoute.get('/user',(req,res)=>{          // Donne le Token dans le Bearer pour affichers les utilisateurs
    authHeader = req.headers['authorization']
    if(authHeader){
        const authToken = authHeader.split(' ')[1]
        if(authToken){
            token.verify(authToken,process.env.Secret, async (err,decode)=>{
                if(!err){
                    const users = await userModel.find()
                    res.json(users)
                }
            })
        } else {
            res.status(401).json({message:'Token non valide'})
        }
    } else {
        res.status(401).json({message:'non autorisé'})
    }
})

userRoute.get('/logout',(req,res)=>{res.cookie('token','').json({message:'Vous êtes déconnecté'})})

module.exports = userRoute