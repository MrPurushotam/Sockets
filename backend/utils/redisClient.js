const redis= require("redis")
require("dotenv").config()
let redisClient;
const createClient=()=>{
    try {
        const url = process.env.REDIS_URL;
        if(!url){
            console.log("Invalid Redis url.")
            process.exit(1)
        }
        const client= new redis.createClient({url})
        return client
        
    } catch (error) {
        console.log("Error ",(error.message))
        process.exit(1)
    }
}

const connectToRedis= async (client)=>{
    try {
        await client.connect()
        console.log("Connected To Redis")
    } catch (error) {
        console.log("Error occured: ", error)
        process.exit(1)
    }
}
if(!redisClient){
    redisClient=createClient()
}
module.exports={redisClient,connectToRedis}