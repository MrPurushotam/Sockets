const {Server}= require("socket.io")
const {SocketIdMiddleware}= require("../middelwares/SocketMiddleware")
const { handleMessage,handleJoiningRoom, handleUserSession, handleConnectedUser, fetchChatHistory } = require("./socketFunctions")

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
        socket.on("error",err=>console.log(err))

        handleUserSession(io,socket,ConnectedUser)

        socket.on("join-room",(room_id)=>{
            handleJoiningRoom(socket,room_id);
        })

        socket.on("connected-users",()=>{
            handleConnectedUser(socket, ConnectedUser)
        })

        socket.on("history",(room_id)=>{
            fetchChatHistory(socket,room_id)
        })
        
        socket.on('message', handleMessage(socket));

        socket.on('disconnect', () => {
            console.log('user disconnected ',socket.id);
            ConnectedUser.delete(socket.userId)
        });
    });

    return io;
}

module.exports=initalizeSocket