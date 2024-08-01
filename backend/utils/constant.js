const jwt= require('jsonwebtoken')
const {redisClient} = require("./redisClient")
const {prefix,expiry, secondaryPrefix, secondaryCacheLimit}= require("./ChatConfig")

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
    const key= `${prefix}-${message.roomId}`
    const secondaryKey=`${secondaryPrefix}-${message.roomId}`
    try {
        const data= await redisClient.rPush(key,JSON.stringify(message),{EX:expiry})
        await redisClient.rPush(secondaryKey,JSON.stringify(message))
        const length = await redisClient.lLen(secondaryKey);
        if (length > secondaryCacheLimit) {
            await redisClient.lTrim(secondaryKey, -secondaryCacheLimit, -1);
        }
        console.log("Message stored in cache",data)
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