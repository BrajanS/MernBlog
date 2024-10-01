const mongoose = require('mongoose')

const articleSchema = new mongoose.Schema({
    title: {
        type:String,
        required:true
    },
    content: {
        type:String,
        required:true
    }
},{timestamps:true})

const articleModel = mongoose.model("articleModel",articleSchema)
module.exports = articleModel