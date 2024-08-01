const { secondaryPrefix } = require("../utils/ChatConfig");
const { storeChatToRedis } = require("../utils/constant");
const { redisClient } = require("../utils/redisClient");


// FIXME: Some error is occuring message isn't properly sent to other users

function handleMessage(socket){
    return async(messageObj)=>{
        console.log("message ", messageObj);
        const message={
            userId:socket.userId,
            username:socket.username,
            message:messageObj.message,
            roomId:messageObj.roomId,
            type:messageObj.type || "default",
            createdAt: new Date().toISOString()
        }
        try {
            await storeChatToRedis(socket,message)
            socket.to(messageObj.roomId).emit('message',message)
        } catch (error) {
            console.log("error occured ",error.message)
            socket.emit('message-error', { error: error.message });
        }
    };
}

function handleJoiningRoom(socket,room_id){
    // console.log(`Socket ${socket.id} trying to join room with id ${room_id}`)
    Object?.keys(socket.rooms).forEach(room => {
        if (room !== socket.id) {
            socket.leave(room);
        }
    });
    socket.join(room_id)
    socket.emit("room-joined",room_id)

    socket.to(room_id).emit("user-joined", {
        userId: socket.userId,
        username: socket.username,
        socketId:socket.id
    });
}

function handleUserSession(io,socket,ConnectedUsers){
    if(ConnectedUsers.has(socket.userId)){
        const existingUser= ConnectedUsers.get(socket.userId)
        io.to(existingUser.socketId).emit('session-closed',{
            message:"Connection closed.Login for different broswer detected",
            exitConnection:true
        })
        const existingSocket = io.sockets.sockets.get(existingUser.socketId);
        if (existingSocket) {
            existingSocket.disconnect(true);
        }
        console.log(`User ${socket.userId} reconnected. Old session (${existingUser.socketId}) terminated.`);
    }
    ConnectedUsers.set(socket.userId, {socketId:socket.id,username:socket.username});
    console.log(`User ${socket.userId} connected with socket ${socket.id}.`);
}

function handleConnectedUser(socket,map){
    try {
        const keys = Array.from(map.keys());
        socket.emit("connected-users", keys);
    } catch (error) {
        console.log("Error occured ",error.message)
    }
}

const fetchChatHistory=async(socket,room_id)=>{
    try {
        const messages = await redisClient.lRange(`${secondaryPrefix}-${room_id}`, 0, -1);
        const parsedMessages = await Promise.all(messages.map(async  msg =>await JSON.parse(msg)));
        socket.emit('history', parsedMessages);
    } catch (error) {
        console.log("Error fetching history: ", error.message);
    }
}


module.exports={handleMessage,handleJoiningRoom,handleUserSession,handleConnectedUser,fetchChatHistory }