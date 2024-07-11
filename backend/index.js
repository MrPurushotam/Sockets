const express = require('express');
const cors=require('cors')
const cookiesParser= require("cookie-parser")
const UserRouter= require("./routes/user");
const { redisClient } = require('./utils/redisClient');

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

app.get("/api/v1/check",async(req,res)=>{
    try {
        const keys= await redisClient.keys("*")
        if(keys){
            return res.json({message:"Data found",keys})
        }
        res.json({message:"Data not found."})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message:"Internal error occured while fetching data.",success:false})
    }
})

app.get("/api/v1/flush",async(req,res)=>{
    try {
        await redisClient.flushAll()
        res.json({message:"Flushed redis cache.",success:true})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message:"Internal error occured while flushing data.",success:false})
    }
})

app.use('/api/v1/user',UserRouter)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});

module.exports=app