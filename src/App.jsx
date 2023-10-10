import './App.css'
import { Route, Routes, useNavigate } from 'react-router-dom'
import ProtectedRoutes from './pages/Protected/ProtectedRoutes1'
import HomePage from './pages/Home/HomePage'
import ChatPage from './pages/Chat/ChatPage'
import Header from './components/shared/Header'
import { useEffect, useState } from 'react'
import JwtExpired from './utils/jwtExpired'
import axios from 'axios'
function App() {

  
  const [login, setLogin] = useState(false);
  const [users, setUsers] = useState()
  const [session, setSession] = useState(false);

  const navigate = useNavigate();

  const handleLogin  = () => {
    
    axios({
      method: 'GET', 
      url: 'http://localhost:8001/api/v1/users/', 
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(response => {
      setLogin(true)
      setUsers(response.data);
    })
    .catch(error => {
      setLogin(false)

      if(error.response.data.message == 'jwt expired'){
        setSession(true)
        setLogin(false)
      setTimeout(() => {
        setSession(false)
      }, 3000);

      navigate('/')

      }
    });
}


  return (
    <div className='principal'>
       {
        session ? <JwtExpired/> : ''
       }
        <Header
        login={login}
        />
      <Routes>
        <Route path='/' element={<HomePage
        handleLogin={handleLogin}
        />}>

        </Route>
          <Route element={<ProtectedRoutes />}>
            <Route path='/chat' element={<ChatPage
            users={users}
            handleLogin={handleLogin}
            />}></Route>
          </Route>
      </Routes>


    </div>
  )
}

export default App
