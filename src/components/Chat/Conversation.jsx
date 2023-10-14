import '../styles/Chat/Conversation.css'

const Conversation = ({

  name,
  image,
  conversation,
  getAllConversations,
  getMessages,
  setConversaId,
  conversaId,
  deleteConversationById,
}) => {

  const userId = localStorage.getItem('userId');

  const handleConver = (id) => {

    setConversaId(id)

    getMessages(id)


  }

  const deleteConversation = async id => {

    await deleteConversationById(id);

    const conversation = await getAllConversations(userId)

    setConversaId(conversation[0].ConversationId)

    getMessages(conversation[0].ConversationId)

  }

  const handleClick = (id) => {

    // Actualizar el estado local con la nueva conversaId

    setConversaId(id)
  }

  return (
    <div onClick={() => handleClick(conversation.ConversationId)} className={`window ${conversaId == conversation.ConversationId ? 'activeConver' : 'activeConver'}`}>
      <div className={`conversation__container ${conversaId == conversation.ConversationId ? 'activeConver' : ''}`} onClick={() => handleConver(conversation.ConversationId)}>

        <div className="conversation__window__button">
          <img className='avatar' src={image} alt="" />
          <div className='name'>{name}<h6 onClick={() => deleteConversation(conversation.ConversationId)} className='close__conversation'>X</h6></div>

        </div>

        <hr className='hr__window' />

      </div>


    </div>

  )
}
export default Conversation