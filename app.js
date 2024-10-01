const express = require('express')
const app = express()
const router = require('./routes.js')
require("dotenv").config({ path: ".env" });
const port = process.env.PORT
const mongoose = require('mongoose')

app.use(express.json())
app.use(router)

const connectBDD = async ()=>{
    try {
        const login = await mongoose.connect(process.env.mongoDB)
        console.log(`Connected into Data base: ${login.connection.db.databaseName}`);
    } catch (error) {
        console.log(error.message);
    }
}
connectBDD();

app.listen(port,()=>{
    console.log(`Server at: http://localhost:${port}`);
})