import { useEffect } from 'react'
import '../styles/Chat/User.css'

const User = ({user, onSelectUser}) => {

  
    return (
        <div className="container__user" onClick={() => onSelectUser(user.UserId)} onContextMenu={e => { e.preventDefault(), console.log(user.firstname)} }>
            <img className='user__image' src="/images/user.png" alt="" />
            <h6 className='user__firstname' >{user.firstname}</h6>
        </div>
    )
}
export default User