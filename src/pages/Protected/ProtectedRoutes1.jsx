import { Navigate, Outlet } from "react-router-dom"


const ProtectedRoutes = () => {
  if(localStorage.getItem('home')){
    return <Outlet/>
  }else{
    return <Navigate to='/'/>
  }
}

export default ProtectedRoutes