const express = require('express');
const cors=require('cors')
const cookiesParser= require("cookie-parser")
const UserRouter= require("./routes/user")

const app= express()

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials:true
}))
app.use(cookiesParser())
app.use(express.json())

app.get("/",(req,res)=>{
    console.log("Hmm")
    res.json({message:"Api is running"})
})
// for user auth 
app.use('/api/v1/user',UserRouter)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});

module.exports=app