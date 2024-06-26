import './App.css'
import {BrowserRouter , Route, Routes} from "react-router-dom"
import SigninPage from './Pages/SigninPage';
import Chat from './Chat';
import Home from './Pages/Home';

function App(){

  return(
    <div className='w-full h-[100vh]'>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<SigninPage/>} />
          <Route path='/chat' element={<Chat/>} />
          <Route path='/' element={<Home/>} />
        </Routes>
      </BrowserRouter>
    
    </div>
  )
}

export default App