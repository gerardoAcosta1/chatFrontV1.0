import { useEffect } from 'react'
import '../styles/Chat/Conversation.css'
const Conversation = ({ name, image, conversation, setConversaId, conversaId, deleteConversationById, mensaje,sendMessages,getMessages, sendingMessage, setSendingMessage, setMensaje }) => {

    const handleConver = (id) =>{
        setConversaId(id)
       getMessages(id)
    }

    useEffect(() => {
        if (sendingMessage && conversaId === conversation.ConversationId) {
          const id = sendMessages(conversaId, mensaje);
          setSendingMessage(false);
          setMensaje('');
          getMessages(conversation.ConversationId)
        }
      }, [sendingMessage, mensaje]);

      const deleteConversation = id => {
        deleteConversationById(id)
      }
    return (
        <div className='window'>
            <div className="conversation__container" onClick={() => handleConver(conversation.ConversationId)}>

                <div className="conversation__window__button">
                    <img className='avatar' src={image} alt="" />
                    <div className='name'>{name}<h6 onClick={() => deleteConversation(conversation.ConversationId)} className='close__conversation'>X</h6></div>
                    
                </div>
                
                <hr className='hr__window'/>
                
            </div>
           
            
        </div>

    )
}
export default Conversation