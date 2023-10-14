import './App.css'
import { Route, Routes, useNavigate } from 'react-router-dom'
import ProtectedRoutes from './pages/Protected/ProtectedRoutes1'
import HomePage from './pages/Home/HomePage'
import ChatPage from './pages/Chat/ChatPage'
import Header from './components/shared/Header'
import { useEffect, useState } from 'react'
import Notices from './utils/Notices'
import axios from 'axios'
function App() {

  
  const [login, setLogin] = useState(false);
  const [users, setUsers] = useState()
  const [session, setSession] = useState(false);
  const [messageNotice, setMessageNotice] = useState('')

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
        setMessageNotice('jwt Expired')
        setSession(true)
        setLogin(false)
      setTimeout(() => {
        setSession(false)
        setMessageNotice('');
      }, 3000);

      navigate('/')

      }
    });
}

const notice = () => {
  setSession(true)

  setTimeout(() => {
    setSession(false)
    setMessageNotice('');
  }, 2000);

}


  return (
    <div className='principal'>
       {
        session ? <Notices
        message={messageNotice}
        /> : ''
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
            setMessageNotice={setMessageNotice}
            notice={notice}
            />}></Route>
          </Route>
      </Routes>


    </div>
  )
}

export default App
