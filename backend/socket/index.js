const {Server}= require("socket.io")
const {SocketIdMiddleware}= require("../middelwares/SocketMiddleware")
const { PrismaClient } =require('@prisma/client')
const {storeChatToRedis}= require("../utils/constant")

const prisma = new PrismaClient()
const ROOM_ID= "1"

const ConnectedUser=new Map()

    const initalizeSocket= (server)=>{
    const io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || "http://localhost:5173",
            METHODS: ["GET", "POST"],
            credentials:true
        }
    });

    io.use(SocketIdMiddleware)
    // FIXME: fix this if jwt is expired the cookies should be cleared automatically

    io.on("connection", (socket) => {
        console.log("User connected: ", socket.id," Username :",socket.username, "& User id :",socket.userId);

        // TODO: Add a function such that if user is already in hashmap then the old user get removed forcefully and other user get feeded in system
        // if(ConnectedUser.has(socket.userId)){
            
        // }
        ConnectedUser.set(socket.userId,{socketId:socket.id,username:socket.username})

        socket.on("history",async()=>{
            
        })

        socket.join(ROOM_ID)
        socket.on('message', async(messageObj) => {
            console.log("message ", messageObj);
            const message={
                userId:socket.userId,
                username:socket.username,
                message:messageObj.message,
                roomId:messageObj.roomId
            }
            try {
                await storeChatToRedis(socket,message)
                socket.to(ROOM_ID).emit('message',message)
            } catch (error) {
                console.log("error occured ",error.message)
            }
        });

        socket.on('disconnect', () => {
            console.log('user disconnected');
            ConnectedUser.delete(socket.userId)
        });
    });

    return io;
}

module.exports=initalizeSocket