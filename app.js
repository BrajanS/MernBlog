const express = require('express')
const app = express()
const cors = require('cors')
const router = require('./routes/routes.js')
const userRoute = require('./routes/userRoute.js')
require("dotenv").config({ path: "settings.env" });
const cookieParser = require('cookie-parser')
const port = process.env.PORT
const mongoose = require('mongoose')

// app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use('',router)
app.use('',userRoute)

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