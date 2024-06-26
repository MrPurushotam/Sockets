const {Server}= require("socket.io")

const MessageArray = [];
let userConnectedIds = [];

const initalizeSocket= (server)=>{
    const io = new Server(server, {
        cors: {
            origin: "*",
            METHODS: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log("user id ", socket.id);
        userConnectedIds.push(socket.id);

        socket.on('message', (messageObj) => {
            console.log("message ", messageObj);
            MessageArray.push(messageObj);
            userConnectedIds.forEach((id) => {
                if (id !== socket.id) {
                    io.to(id).emit('message', messageObj);
                }
            });
        });

        socket.on('disconnect', () => {
            console.log('user disconnected');
            userConnectedIds = userConnectedIds.filter((id) => id !== socket.id);
        });
    });

    return io;
}

module.exports=initalizeSocket