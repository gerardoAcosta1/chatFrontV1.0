import '../styles/Chat/Messages.css'
const Messages = ({ message, senderId }) => {

  return (
    <div className='messageFlex'>
      <h3 className={message.Sender === 'server' ? 'connect' : message.Sender == 'botesito'  ? 'botesito' :  message.Sender == 'server1' ?  'disconnect' : 'Sender'}>{message.Sender ? message.Sender : senderId}</h3>
      <h3>: {message.content}</h3>
    </div>

  )
}

export default Messages
