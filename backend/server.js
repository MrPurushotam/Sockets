const {createServer}=require("http")
const app= require('./index')
const initalizeSocket= require("./socket/index")
const setupChatRoutes=require("./routes/chat")
const {redisClient,handleRedisClientConnection}= require("./utils/redisClient")

const server= createServer(app)
const io=initalizeSocket(server)
require('dotenv').config()

// How we should send and recieve message? 
// {
//     message:"",
//     time:"",
//     senderId:"",
//     roomId:"",
// }
try {
    handleRedisClientConnection(redisClient)
} catch (error) {
    process.exit(1)
}

const chatRouter= setupChatRoutes(io)
app.use('/api/v1/chat', chatRouter);

const PORT = process.env.PORT || 3000;
server.listen(PORT,()=>{
    console.log("Server running on 3000")
})