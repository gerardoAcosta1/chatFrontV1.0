import '../styles/Chat/User.css'

const User = ({userEmit, user, onSelectUser, }) => {
    
    return (
        <div className="container__user" onClick={() => onSelectUser(user?.UserId)} onContextMenu={e => { e.preventDefault(), console.log(user?.firstname)} }>
            <img className='user__image' src="/images/user.png" alt="" />
            <h6 className='user__firstname' >{user?.User.username}</h6>
            {userEmit === user?.User.username ? <h4 className='sound-emission'></h4> : ''}
        </div>
    )
}
export default User