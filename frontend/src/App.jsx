import { useEffect, useState } from 'react'
import './App.css'
import { io } from "socket.io-client";
import axios from "axios" 

function App() {
  const[socket ,setSocket]=useState(null)
  const [message, setMessage]=useState(["thing","something else"])
  const [sendmessage,setSendmessage]=useState("")

  useEffect(()=>{
    socket?.on("message",(message)=>{
      setMessage(prev=>[...prev,message])
    })
  },[socket])

  const SocketFunction=()=>{
    if(socket){
      socket.disconnect();
      setSocket(null)
      return
    }
    const newsocket=io("http://localhost:3000/")
    setSocket(newsocket)
  }
  const sendMessage=async()=>{
    if(socket){
      socket.emit("message",sendmessage)
    }
    document.getElementById("MessageBox").innerHTML=""
    setSendmessage("")
  }
  return (
    <div className='flex justify-center items-center h-[100vh] w-full flex-col space-y-5'>
      <h1 className='text-xl text-center font-semibold shadow-md'>WebSocket SelfLearning Tutorial</h1>
      <button className={`text-xl font-semibold text-white ${socket?"bg-red-500":"bg-black"} p-3 w-1/3 mx-auto`} onClick={SocketFunction}>{socket?"Disconnect":"Connect"}</button>
      <div className='min-h-[50vh] max-h-[70vh] h-auto border-2 border-gray-300 rounded-md w-1/2 p-2 overflow-auto'>
        <h1 className='text-center font-medium text-gray-500 shadow-md p-2 '>All Messages</h1>
        <div className='font-medium text-lg text-purple-600 w-full space-y-3 my-3 h-4/5 overflow-auto'>
          {message.map(m=>(
            <p className='border-2 broder-gray-100 shadow-md rounded-md w-4/5 px-4 py-2'>
              {m}
            </p>
          ))}
        </div>
        <div className='w-full flex'>
          <textarea className='w-full border-gray-300 border-2 rounded-md' placeholder="Enter your message here" 
          id='MessageBox'
          value={sendmessage}
          onKeyDown={(e)=>{
            if(e.key==="Enter" && e.shiftKey){
              sendMessage()
            }}
          }
          onChange={(e) => {
              setSendmessage(e.target.value)
            }}
          />
          <button className='text-xl font-semibold text-white bg-black p-1 rounded-md' onClick={sendMessage}>Send<span className="text-[10px] leading-none text-semibold text-underline block text-sky-500">Shift+ Enter</span></button>
        </div>
      </div>
    </div>
  )
}

export default App
