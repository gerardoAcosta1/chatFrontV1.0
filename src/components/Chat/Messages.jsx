import '../styles/Chat/Messages.css'
const Messages = ({message}) => {

  return (
    
    <div className="container__messages">
        <ul className='container__message'>
        <p>{ } </p>
            <li>{message}</li>
        </ul>
    </div>
  )
}

export default Messages
