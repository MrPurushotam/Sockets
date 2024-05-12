
const Server= require("socket.io")
const express = require('express');
const path =require("path")
const cors=require('cors')
const { createServer, METHODS } = require('http');
const app= express()
const server=createServer(app)
const io =Server(server,{cors:{
    origin:"*",
    METHODS:["GET","POST"]
}})
const MessageArray=[]
let userConnectedIds=[]

// How we should send and recieve message? 
// {
//     message:"",
//     time:"",
//     senderId:"",
//     roomId:"",
// }


app.get("/",(req,res)=>{
    console.log("Hmm")
    res.json({message:"thing"})
})

io.on("connection",(socket)=>{
    console.log("user id ",socket.id)
    userConnectedIds.push(socket.id)
    socket.on('message',(messageObj)=>{
        console.log("message ",messageObj);
        MessageArray.push(messageObj)
        userConnectedIds.forEach((id) => {
            if (id !== socket.id) {
              io.to(id).emit('message', messageObj);
            }
        });
    })
    // socket.on('message',(message)=>{
    //     console.log("message ",message);
    //     MessageArray.push(message)
    //     userConnectedIds.forEach((id) => {
    //         if (id !== socket.id) {
    //           io.to(id).emit('message', message);
    //         }
    //     });
    // })
    
    socket.on('disconnect', () => {
      console.log('user disconnected');
      userConnectedIds=userConnectedIds.filter((id)=>id!==socket.id)
        // emit event to let others know user has disconnected
    });
})

server.listen(3000,()=>{
    console.log("server up on 3000")
})

// STATUS: Need to make process stream line 
// need to work on chats such that if new user join then he or she can view previous chats 
// need to add more validation with saving data to backend and more...