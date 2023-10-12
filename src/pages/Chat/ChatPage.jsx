import { useEffect, useState } from 'react';
import User from '../../components/Chat/User';
import '../styles/Chat/ChatPage.css';
import UseFetch from '../../hooks/UseFetch';
import Conversation from '../../components/Chat/Conversation';
import Messages from '../../components/Chat/Messages';

const ChatPage = ({  handleLogin }) => {

    const [conver, setConver] = useState(false)

    const [mensaje, setMensaje] = useState(''); // Estado para almacenar el mensaje

    const [sendingMessage, setSendingMessage] = useState(false);

    const [conversaId, setConversaId] = useState();

    const [conversations2, setConversations2] = useState([])



    //################## server conections ###############################
    const { 
        createConversation, 
        getAllConversations, 
        sendMessages,
        getMessages,  
        deleteConversationById,
        conversations, 
        messages,
        converId  
    } = UseFetch();


    //############### Use Effect #################
    const fetchData = async () => {

        const { id: userId } = JSON.parse(localStorage.getItem('users'));

        handleLogin()

        const conversations = await getAllConversations(userId);
        
        await setConversaId(conversations[0].ConversationId)
       
        getMessages(conversations[0].ConversationId); 

        setConversations2(conversations)

    };

useEffect(() => {
    
    fetchData();
    
}, []);

//############## conversations Create ########################################

const checkConversationExists = async (userId, participantId) => {

    const conversations = await getAllConversations(userId);

    return conversations.some(conversation => {

        const participants = conversation.Conversation.Participants;

        const hasUser = participants.some(participant => participant.UserId === userId);

        const hasParticipant = participants.some(participant => participant.UserId === participantId);

        return hasUser && hasParticipant;
    });

};

const onSelectUser = async (participantId) => {

    const { id: userId } = JSON.parse(localStorage.getItem('users'));
    const body = { userId, participantId };

    const conversationExists = await checkConversationExists(userId, participantId);
   
    if (!conversationExists) {
       await createConversation(body); // Esperar a que se cree la conversación
        await getAllConversations(userId); // Obtener las conversaciones
       
    } else {
        alert("Ya tienes una conversación con este usuario");
        alert(conversationExists)
    }
   
    setConver(!conver)
    setActive(true)
};


//############## Paticipants User ########################################

    const getParticipantInfo = (participants) => {

        const { id } = JSON.parse(localStorage.getItem('users'));

        const participant = participants?.filter(participant => participant.UserId !== id)[0];
        
        const info = {
            name: participant?.User?.firstname,
            avatar: participant?.User?.avatar
        }

        return info
    };

   //############## Create Messages ########################################

    const handleMensajeChange = (event) => {
        setMensaje(event.target.value);

        
    };

    // Función para manejar el envío del mensaje
    const handleSubmit = (event) => {

        event.preventDefault();

        const { id: senderId } = JSON.parse(localStorage.getItem('users'));

        const mensajeData = {
            content: mensaje,
            senderId: senderId
          };

        setMensaje(mensajeData);

        setSendingMessage(true)
        getMessages(converId)

    };

    const participants = () => {
        if (conversations2.length === 0) {
          return [];
        }
        const conversation = conversations2.find(
          (conv) => conv.ConversationId === conversaId
        );
    
        if (conversation) {
          return conversation.Conversation.Participants;
        }
        return [];
      };

    //############## all JSX ########################################

    return (

        <div className="main__chatPage">

            <div className='main__conversations'>
                {
                    conversations?.map(conversation => (
                        <Conversation
                        
                            deleteConversationById={deleteConversationById}
                            name={conversation.Conversation.title ??
                                getParticipantInfo(conversation?.Conversation.Participants).name}

                            image={conversation.Conversation.type === 'group'
                                ?
                                conversation.Conversation.conversationImage
                                :
                                getParticipantInfo(conversation?.Conversation.Participants).avatar}

                            key={conversation?.Conversation.id}
                            conversation={conversation}
                            mensaje={mensaje}
                            sendingMessage={sendingMessage}
                            setSendingMessage={setSendingMessage}
                            setMensaje={setMensaje}
                            sendMessages={sendMessages}
                            conversaId={conversaId}
                            setConversaId={setConversaId}
                            getMessages={getMessages}
                           
                        />
                    ))
                }

            </div>

            <div className='chat__container'>
                <div className='chat__lienzo'
                >
                    {
                        conversaId
                        ?
                        <ul className='ul__chat'>
                            <li>{ messages.slice().sort((a, b) => a.updateAt - b.updateAt)?.map(message => (
                            
                            <Messages 
                            key={message.id}
                            message={message}
                            conversaId={conversaId}
                            User={User}
                            />
                            
                        ))}</li>
                       
                        </ul>
                        :
                        ''
                        
                    }
                </div>

                <form className='chat__container__input' onSubmit={handleSubmit}>
                    <input className='chat__input' type="text" placeholder="Escribe tu mensaje"
                        value={mensaje}
                        onChange={handleMensajeChange} />
                    <button className='chat__send' type='submit'>send{'--'}</button>
                </form>
            </div>

            <div className='container__users'>

    {
        participants()?.map(user => {
            
            return (
                
                <User
                    onSelectUser={onSelectUser}
                    key={user.UserId}
                    user={user.User}
                />
            );
        })
    }
</div>




        </div>
    )
}

export default ChatPage