import { useEffect, useRef, useState } from 'react';
import User from '../../components/Chat/User';
import '../styles/Chat/ChatPage.css';
import UseFetch from '../../hooks/UseFetch';
import Conversation from '../../components/Chat/Conversation';
import Messages from '../../components/Chat/Messages';
import { initWebSocket } from '../../utils/initWebSocket';
import functionsRender from '../../utils/functionsRender';

const ChatPage = ({ users, handleLogin, notice, setMessageNotice }) => {

    const [mensaje, setMensaje] = useState('');
    const [conversaId, setConversaId] = useState(null);
    const [socket, setSocket] = useState(initWebSocket());
    const [entrante, setEntrante] = useState(false)

    const chatLienzoRef = useRef(null);
    const id = localStorage.getItem('userId');
    const userId = parseInt(id)
    const username = localStorage.getItem('username')

    const {functions} = functionsRender()
    
    const {
        clienteApi,
        conversations,
        messages
    } = UseFetch();

    //############# Sockets en New Messages #########################
   

    useEffect(() => {
       
        functions.scrollToBottom(chatLienzoRef)

    }, [messages]);

    useEffect(() => {
        clienteApi.getMessages(conversaId)
        socket.on('message', reseiveMessage);
        socket.on('userConnected', userConnect);
        socket.on('disconnecting', userDisconnect);
        return () => {
            socket.off('message', reseiveMessage);
            socket.off('userConnected', userConnect);
            socket.off('disconnecting', userDisconnect);
        }
        
    }, [socket]);

    const userConnect = (message) => {
       console.log(message)
        if (message.type === 'userConnected') {
            console.log("Received message:", message);
            console.log("Current messages:", messages);
            clienteApi.sendMessages(message.conversationId, message);
            clienteApi.getMessages(message.conversationId)
        }
    }
    
    const userDisconnect = (message) => {
     
        if (message.type === 'disconnecting') {
            clienteApi.sendMessages(message.conversationId, message);
            clienteApi.getMessages(message.conversationId)
        }
    }
    const reseiveMessage = (message) => {

        if (message) {
            setEntrante(true)
            setConversaId(message.conversationId)
            console.log("Received message:", message);
            console.log("Current messages:", messages);
           clienteApi.getMessages(message.conversationId);
            
            if(messages){
                clienteApi.setMessages(preview => [message, ...preview]);
                console.log('aqui')
                clienteApi.getMessages(message.conversationId)
            }
            const chatLienzo = document.querySelector('.chat__lienzo');
            chatLienzo.scrollTop = chatLienzo.scrollHeight;
        }
    }

    useEffect(()=> {
        clienteApi.getMessages(conversaId)
        setEntrante(false)
    },[entrante, conversaId])

    //############# fetch data #########################

    const fetchData = async () => {
       await handleLogin()
        const conversation = await conversations?.find((conv) => conv?.Conversation?.title === 'General');
       
        if (!conversation) {
           
           const users = await clienteApi.getUsers()
          
            const idUsers = await users?.map(user => user?.id);
           
            if (users) {
              
                const body = {
                    participantIds: idUsers,
                    title: 'General'
                }
               
                const newGeneral = await clienteApi.createComversationGroup(body, userId);
                
                setConversaId(newGeneral.id)

                await clienteApi.getMessages(newGeneral.id)
               
                socket.emit('joinConversation', newGeneral.id,username,userId);
               
            }
        }else{
            await clienteApi.getMessages(conversation.Conversation.id)
        }
       
    };

    useEffect(() => {

        handleLogin()
      
        fetchData()

    }, []);
    const onSelectUser = async (participantId) => {

        const body = {
            usersId: [userId, participantId]
        }

        const conversationExists = await functions.checkConversationExists(userId, participantId);

        if (!conversationExists) {
            
            if (userId == participantId) {

                setMessageNotice('No es posible crear una conversación contigo mismo');
                notice();

            } else {
                
                const newConversation = await clienteApi.createConversation(body,userId);

                setConversaId(newConversation.id);
                
                socket.emit('joinConversation', newConversation.id, username, userId);

            }
        } else {

            setMessageNotice(`Ya estás en una conversacion con este usuario`);
            notice();
        }
    };

    const handleMensajeChange = (event) => {
        setMensaje(event.target.value);
    };

    const handleSubmit = (event) => {

        event.preventDefault();

        const mensajeData = {
            content: mensaje,
            SenderId: userId,
            Sender: username
        };

        const mensajeDataSocket = {
            content: mensaje,
            SenderId: userId,
            Sender:username,
            conversationId: conversaId
        };

        clienteApi.sendMessages(conversaId, mensajeData);
     
        const mensajeJSON = JSON.stringify(mensajeDataSocket);

        // Envía la cadena JSON al servidor
        socket.emit('message', mensajeJSON);

        clienteApi.getMessages(conversaId)
        setEntrante(true)
        

        setMensaje('');

    };

    const participants = () => {

        if (Array.isArray(conversations) && conversations.length > 0) {

          const conversation = conversations.find((conv) => conv?.Conversation?.id == conversaId);

          if (conversation) {

            return conversation.Conversation?.Participants || [];
          }
        }
      
        return [];
      };


    //############## all JSX ########################################

    return (

        <div className="main__chatPage">

            <div className='main__conversations'>
                {
                    !conversations.map ||
                    conversations?.map(conversation => (
                        <Conversation

                            clienteApi={clienteApi}
                            name={conversation?.Conversation?.title ??
                               functions.getParticipantInfo(conversation?.Conversation?.Participants).name}

                            image={conversation?.Conversation?.type === 'group'
                                ?
                                conversation?.Conversation?.conversationImage
                                :
                                functions.getParticipantInfo(conversation?.Conversation?.Participants).avatar}

                            key={conversation?.Conversation?.id}
                            conversation={conversation}
                            conversaId={conversaId}
                            setConversaId={setConversaId}


                        />
                    ))

                }

            </div>

            <div className='chat__container' id='scroll'>
                <div className='chat__lienzo' id='scroll' ref={chatLienzoRef}>
                    {
                        conversaId && messages.length > 0
                            ?
                            <ul className='ul__chat ' id='scroll'>
                                {
                                    
                                }
                                <li>{messages?.map((message, i) => (

                                    <Messages
                                        key={i}
                                        message={message}
                                        senderId={message.SenderId}
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
                                key={user?.UserId}
                                user={user}
                            />
                        );
                    })
                }
            </div>

        </div>
    )
}

export default ChatPage