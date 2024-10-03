const express = require('express')
const route = express()
const articleModel = require('../models/model.js')

route.get('/', async (req,res)=>{
    try {
        res.status(200).send(`<h1 style='display:flex;justify-content:center;color:blue;font-size:58px'>Page principale de Révision Node JS</h1>`)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

route.get('/article',async(req,res)=>{
    try {
        const articles = await articleModel.find()    // Gets all Articles
        res.status(200).json(articles)      
    } catch (error) {
        console.log(error.message);}
})

route.post('/article', async (req,res)=>{
    try {
        const data = req.body
        await articleModel.create(data)
        res.status(200).json("Article ajouté")
    } catch (error) {
        res.status(500).json({
            message: error.message})}
})

route.get('/article/:id',async (req,res)=>{
    try {
        const {id} = req.params
        const read = await articleModel.findById(id)
        res.status(200).json(read)
    } catch (error) {
        res.status(500).json({
            message: error.message})}
})

route.put('/article/:id',async (req,res)=>{
    try {
        const {id} = req.params
        const data = req.body
        await articleModel.findByIdAndUpdate(id,data)
        res.status(200).json({message:"Article modifié !"})
    } catch (error) {
        res.status(500).json({
            message: error.message})}
})

route.delete('/article/:id',async (req,res)=>{
    try {
        const {id} = req.params
        await articleModel.findByIdAndDelete(id)
        res.status(200).json({message:"Article supprimé"})
    } catch (error) {
        res.status(500).json({
            message: error.message})}
})

module.exports = route