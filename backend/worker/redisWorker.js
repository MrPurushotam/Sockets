const { key } = require("../utils/ChatConfig")
const { redisClient,connectToRedis } = require("../utils/redisClient")
const { parentPort } = require('worker_threads');
const { PrismaClient } =require('@prisma/client')

const prisma = new PrismaClient();
const connect= (redisClient)=>{
    try {
        connectToRedis(redisClient)
        console.log("WorkerThread Connected To Redis")
    } catch (error) {
        console.log("WorkerThread Error: ",error.message)
        process.exit(1)
    }
}

redisClient.on('error',(err)=>{

})
connect(redisClient)

const getMessageFromCache=async()=>{
    try {
        //static key for time being later figure out some logic  
        console.log("In get message from cacahe")
        const value=await redisClient.lRange(key ,0, -1);
        return Promise.all(value.map(async(msg)=>await JSON.parse(msg)))
    } catch (error) {
        console.log("WorkerThread Error: ",error.message)
        return [];
    }
}

const uploadToDB=async(messages)=>{
    try {
        const resp = await prisma.message.createMany({
            data:messages,
            skipDuplicates:true
        })
        console.log(resp)
        console.log(`Messages from cache inserted in database successfully.`)
        const delData= await redisClient.lTrim(key,messages.length , -1);
        console.log(delData)
    } catch (error) {
        console.log("WorkerThread Error occured while pushing cache to database. ", error.message)
    }
}

const Worker=async()=>{
    try {
        console.log("Worker Triggered")
        const message=await getMessageFromCache();
        console.log("Worker fetched messages",message)
        if(message.length>0){
            console.log("Updating messages to db")
            await uploadToDB(message)
        }
    } catch (error) {
        console.log("WorkerThread Error:-",error.message)
    }
}

const WorkerInterval=15*60*1000

setInterval(async()=>{
    console.log("WorkerThread Interval function")
    await  Worker()
},WorkerInterval)

parentPort.on("message",async (message)=>{
    if(message.type==="TriggerWorker"){
        await Worker()
    }
})