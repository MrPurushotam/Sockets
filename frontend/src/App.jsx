import './App.css'
import {BrowserRouter , Route, Routes} from "react-router-dom"
import SigninPage from './Pages/SigninPage';
import Chat from './Chat';
import Home from './Pages/Home';
import { SecureDashboardRoute,SecureLogin} from "./components/ProtectRoute"

function App(){

  return(
    <div className='w-full h-[100vh]'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>} />

          <Route element={<SecureLogin/>}>
            <Route path='/login' element={<SigninPage/>} />
          </Route>

          <Route element={<SecureDashboardRoute/>}>
            <Route path='/chat' element={<Chat/>} />
          </Route>
          
        </Routes>
      </BrowserRouter>
    
    </div>
  )
}

export default App