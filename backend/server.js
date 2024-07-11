const {createServer}=require("http")
require('dotenv').config();

const app= require('./index')
const initalizeSocket= require("./socket/index")
const setupChatRoutes=require("./routes/chat")
const {redisClient, connectToRedis}= require("./utils/redisClient")

const server= createServer(app)
const io=initalizeSocket(server)

const connect= (redisClient)=>{
    try {
        connectToRedis(redisClient)
    } catch (error) {
        console.log("Error ",error.message)
        process.exit(1)
    }


}
connect(redisClient)
const chatRouter= setupChatRoutes(io)
app.use('/api/v1/chat', chatRouter);

const PORT = process.env.PORT || 3000;

server.listen(PORT,()=>{
    console.log("Server running on 3000")
})