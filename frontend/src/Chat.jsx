import { useEffect, useRef, useState } from 'react'
import { io } from "socket.io-client";
import api from './utils/Api';
import { useNavigate } from 'react-router-dom';


function Chat() {
  const navigate=useNavigate()
  const [socket, setSocket] = useState(null)
  const [message, setMessage] = useState([{ message: "thing", timestamp: Date.now(), senderId: 1 }, { message: "something", timestamp: Date.now(), senderId: 1 }])
  const [sendmessage, setSendmessage] = useState("")
  const myid = useRef(null)
  const focus=useRef(null)
  const textareaRef = useRef(null);
  useEffect(() => {
    if (socket && !myid.current) {
      myid.current = socket.id
    }
    socket?.on("message", (message) => {
      setMessage(prev => [...prev, message])
    })
  }, [socket, myid])

  const SocketFunction = () => {
    if (socket) {
      socket.disconnect();
      myid.current = null
      setSocket(null)
      return
    }
    const newsocket = io("http://localhost:3000/",{withCredentials: true})
    myid.current = newsocket.id
    setSocket(newsocket)
  }
  const scrollToBottom = () => {
    focus.current?.scrollIntoView({ behavior: "smooth" });
  }
  const sendMessage = async () => {
    const messageObj = {
      message: sendmessage.trim(),
      roomId:1
    }
    setMessage(prev => [...prev, messageObj])
    scrollToBottom()
    if (socket) {
      socket.emit("message", messageObj)
    } else {
      alert("Socket not connected")
    }
    setSendmessage("")
    textareaRef.current?.focus();
  }
  const logout= async ()=>{
    await api.get("/user/logout")
    console.log("Logged out")
    navigate("/login")
  }
  return (
    <div className='flex justify-center items-center h-[100vh] w-full flex-col space-y-5'>
      <button className='bg-red-500 px-3 py-5 text-lg font-semibold text-white rounded-md' onClick={logout}>logout</button>
      <button className='text-red-500 border-2' 
      onClick={async()=>{
        console.log("Hit")
        const resp=await api.get("/check")
        const data=await resp.data
        console.log(data)
      }}>Redis</button>
      <h1 className='text-xl text-center font-semibold shadow-md'>WebSocket SelfLearning Tutorial Your Id:{myid.current || socket?.id}</h1>
      <button className={`text-xl font-semibold text-white ${socket ? "bg-red-500" : "bg-black"} p-3 w-1/3 mx-auto`} onClick={SocketFunction}>{socket ? "Disconnect" : "Connect"}</button>
      <div className='min-h-[50vh] max-h-[70vh] h-auto border-2 border-gray-300 rounded-md w-1/2 p-2 overflow-auto'>
        <h1 className='text-center font-medium text-gray-500 shadow-md p-2 '>All Messages</h1>


        <div className='font-medium text-lg text-purple-600 w-full space-y-3 my-3 h-4/5 overflow-auto' ref={focus}>
          {message.map((m, i) => (
            <div key={i} className={`w-full flex ${m.senderId === socket?.id ?"justify-end":"justify-normal"}`}>
              <div className={`flex flex-col h-[auto] w-3/5 border-2 border-gray-100 shadow-md rounded-md text-black ${m.senderId === socket?.id ? 'bg-[#a5be00]' : 'bg-[#eff1ed]'}`}>
                <div className='flex items-start'>
                  <p className='text-xs px-2'>{m.senderId || m.userId}</p>
                </div>
                <p className={`flex-1 w-full px-4 py-1`}>
                  {m.message}
                </p>
                <div className='flex justify-end'>
                  <p className='text-xs px-2'>{m.timestamp || m.createdAt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>


        <div className='w-full flex'>
          <textarea className='w-full border-gray-300 border-2 rounded-md' placeholder="Enter your message here"
            id='MessageBox'
            value={sendmessage}
            ref={textareaRef}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.shiftKey) {
                sendMessage()
              }
            }
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

export default Chat
