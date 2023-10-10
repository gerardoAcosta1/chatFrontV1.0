import '../styles/Chat/Messages.css'
const Messages = ({message}) => {
  
  return (
    
    <div className="container__messages">
        <ul className='container__message'>
        <p>12:12: </p>
            <li>{message.content}</li>
        </ul>
    </div>
  )
}

export default Messages
