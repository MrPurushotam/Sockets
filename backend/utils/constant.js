const jwt= require('jsonwebtoken')
const {redisClient} = require("./redisClient")
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
    console.log("Inside redis add function")
    console.log(message)
    const timestamp = Date.now();
    const key= `${prefix}-${socket.userId}:${timestamp}`
    console.log(key)
    try {
        const data=await redisClient.rPush(key,JSON.stringify(message))
        await redisClient.expire(key,expiry);
        console.log("data",data,expiry)
        console.log("Stored inside")
    } catch (error) {
        console.log("Error occured ",error.message)
    }
}
// think about it
async function clearRedisTable(){
    await redisClient.flushDb();
    console.log("Flushed Table")
}

module.exports={verifyToken , createToken,storeChatToRedis,clearRedisTable}