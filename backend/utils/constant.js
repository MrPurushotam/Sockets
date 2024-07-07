const jwt= require('jsonwebtoken')
const redisClient = require("./redisClient")
const {prefix,expiry}= require("./ChatConfig")

function createToken(object){
    const token = jwt.sign(object,process.env.SECRET_KEY,{expiresIn:'3d'})
    return token
}

function verifyToken(token){
    try {
        const data = jwt.verify(token,process.env.SECRET_KEY)
        return {success:true, data}
    }catch (error) {
        console.log("Error in Token: ",JSON.stringify(error))
        if(error.name="TokenExpiredError"){
            return {success:false, jwtExpire:true}
        }
        return {success:false}
    }
}

async function storeChatToRedis(socket,message){
    const timestamp = Date.now();
    const key= `${prefix}-${socket.id}:${timestamp}`
    try {
        await redisClient.rpush(key,JSON.stringify(message))
        await redisClient.expire(key,expiry);   
    } catch (error) {
        console.log("Error occured ",JSON.stringify(error))
    }
console.log("Inside redis cache")
}
// think about it
async function clearRedisTable(socket){
    await redisClient.flushdb()
    console.log("Flushed Table")
}

module.exports={verifyToken , createToken,storeChatToRedis,clearRedisTable}