const {createServer}=require("http")
const app= require('./index')
const initalizeSocket= require("./socket/index")
const setupChatRoutes=require("./routes/chat")
const server= createServer(app)
const io=initalizeSocket(server)


// How we should send and recieve message? 
// {
//     message:"",
//     time:"",
//     senderId:"",
//     roomId:"",
// }

const chatRouter= setupChatRoutes(io)
app.use('/api/v1/chat', chatRouter);

server.listen(3000,()=>{
    console.log("Server running on 3000")
})