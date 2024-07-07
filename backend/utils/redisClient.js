const Redis = require("ioredis");
require("dotenv").config()

const initalizeRedis=()=>{
    const serviceUri = process.env.REDIS_URL
    if(!serviceUri){
        throw new Error("Redis URL Not found")
    }
    const redisClient = new Redis(serviceUri);
    return redisClient
}

const handleRedisClientConnection=(redisClient)=>{
    return new Promise((resolve,reject)=>{
        redisClient.on("connect",()=>{
            console.log("Connected to redis database.")
            resolve(redisClient)
        })
        redisClient.on("error",(err)=>{
            console.log("Error occured during redis client connection",err.message)
            reject(err)
        })
    })
}
const redisClient = initalizeRedis()
module.exports={redisClient,handleRedisClientConnection}