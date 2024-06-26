const express = require('express');
const cors=require('cors')
const cookiesParser= require("cookie-parser")
const UserRouter= require("./routes/user")

const app= express()

require('dotenv').config()
app.use(cors())
app.use(cookiesParser())
app.use(express.json())

app.get("/",(req,res)=>{
    console.log("Hmm")
    res.json({message:"thing"})
})
// for user auth 
app.use('/api/v1/user',UserRouter)

module.exports=app