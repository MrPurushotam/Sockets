const express = require('express');
const cors=require('cors')
const cookiesParser= require("cookie-parser")
const UserRouter= require("./routes/user");
const {Worker}= require("worker_threads");
const { key } = require('./utils/ChatConfig');
const {redisClient, connectToRedis}= require("./utils/redisClient")

const app= express()
const worker= new Worker("./worker/redisWorker.js")
const CacheLengthLimit=500

const connect= (redisClient)=>{
    try {
        connectToRedis(redisClient)
        console.log("Connected To Redis")
    } catch (error) {
        console.log("Error ",error.message)
        process.exit(1)
    }
}

connect(redisClient)
// catches unassumed error's
redisClient.on('error',(err)=>{
    console.log("Unexpected Error occured due to redis at index.js file ",err.message)
})


worker.on('message', (message) => {
    if (message.type === 'error') {
        console.error('Worker error:', message.message);
    } else if (message.type === 'info') {
        console.log('Worker info:', message.message);
    }
});

worker.on('error', (error) => {
    console.error('Worker threw an error:', error);
});

worker.on('exit', (code) => {
    if (code !== 0) {
        console.error(`Worker stopped with exit code ${code}`);
    }
});

const CacheLengthBound=async()=>{
    try{
        const CacheLength= await redisClient.lLen(key);
        if(CacheLength>CacheLengthLimit){
            worker.postMessage({type:"TriggerWorker"})
        }
    }catch(err){
        console.log("Error occurs: ",err.message)
    }
}
setInterval(async () => {
    await CacheLengthBound();
}, 5000)

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

app.get("/api/v1/get/:key",async(req,res)=>{
    try {
        const key=req.params.key
        if(!key){
            return res.json({message:"Please provide the key.",success:false})
        }
        const data= await redisClient.lRange(key,0,-1)
        res.json({message:"List fetched.",data})

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