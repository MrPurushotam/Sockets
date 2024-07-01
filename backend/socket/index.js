const {Server}= require("socket.io")
const {SocketIdMiddleware}= require("../middelwares/SocketMiddleware")
const { PrismaClient } =require('@prisma/client')


const prisma = new PrismaClient()
const ROOM_ID= "1"

const MessageArray = [];
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

    io.on("connection", (socket) => {
        console.log("User connected: ", socket.id," Username :",socket.username, "& User id :",socket.userId);
        ConnectedUser.set(socket.userId,{socketId:socket.id,username:socket.username})

        console.log("user id ", socket.id);
        // userConnectedIds.push(socket.id);
        socket.join(ROOM_ID)

        socket.on('message', async(messageObj) => {
            console.log("message ", messageObj);
            const message= await prisma.message.create({
                data:{
                    userId:socket.userId,
                    username:socket.username,
                    message:messageObj.message,
                    roomId:ROOM_ID
                },select:{
                    id:true,
                    message:true,
                    username:true,
                    userId:true,
                    roomId:true,
                    createdAt:true
                }
            })
            console.log(message)
            MessageArray.push(message);
            // manual way of sending message to individual user 
            // ConnectedUser.forEach((user) => {
            //     if (user.socketId !== socket.id) {
            //         io.to(user.socketId).emit('message', message);
            //     }
            // });
            socket.to(ROOM_ID).emit('message',message)
        });

        socket.on('disconnect', () => {
            console.log('user disconnected');
            ConnectedUser.delete(socket.userId)
        });
    });

    return io;
}

module.exports=initalizeSocket