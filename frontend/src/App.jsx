import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup from './components/Auth/Signup/Signup'
import Login from './components/Auth/Login/Login'
import Home from './pages/home'
import { AuthProvider } from './context/authContext/authContext'
import { SocketProvider } from './context/socketContext'

function App() {
  return (
    <SocketProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Login/>} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/home' element={<Home/>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </SocketProvider>
  )
}

export default App
