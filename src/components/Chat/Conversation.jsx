import '../styles/Chat/Conversation.css'

const Conversation = ({

  name,
  image,
  conversation,
  

  setConversaId,
  conversaId,
 clienteApi
}) => {

  const userId = localStorage.getItem('userId');


  const deleteConversation = async id => {

    await clienteApi.deleteConversationById(id);
    
  }

  const handleClick = async (id) => {
    const userId = localStorage.getItem('userId');
    //Actualizar el estado local con la nueva conversaId

    setConversaId(id)
   await clienteApi.getAllConversations(userId)
    clienteApi.getMessages(id)
 
  }

  return (
    <div onClick={() => handleClick(conversation?.Conversation?.id)} className={`window ${conversaId == conversation?.Conversation?.id ? 'activeConver' : 'activeConver'}`}>
      <div className={`conversation__container ${conversaId == conversation?.Conversation?.id ? 'activeConver' : ''}`}>

        <div className="conversation__window__button">
          <img className='avatar' src={image} alt="" />
          <div className='name'>{name}<h6 onClick={() => deleteConversation(conversation?.Conversation?.id)} className='close__conversation'>X</h6></div>

        </div>

        <hr className='hr__window' />

      </div>


    </div>

  )
}
export default Conversation