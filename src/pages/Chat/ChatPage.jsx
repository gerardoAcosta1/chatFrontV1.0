import { useEffect, useState } from 'react';
import User from '../../components/Chat/User';
import '../styles/Chat/ChatPage.css';
import UseFetch from '../../hooks/UseFetch';
import Conversation from '../../components/Chat/Conversation';
import Messages from '../../components/Chat/Messages';
import { initWebSocket } from '../../utils/initWebSocket';

const ChatPage = ({ users, handleLogin, notice, setMessageNotice }) => {

    const [mensaje, setMensaje] = useState('');
    const [localMessage, setLocalMessage] = useState([]);
    const [conversaId, setConversaId] = useState();
    const [conversations2, setConversations2] = useState([]);
    const [active, setActive] = useState(false);
    const [socket, setSocket] = useState(initWebSocket());


    const  id = localStorage.getItem('userId');
    const userId = parseInt(id)



    const {
        createConversation,
        createComversationGroup,
        getAllConversations,
        sendMessages,
        getMessages,
        setMessages,
        deleteConversationById,
        messages,
        conversations
    } = UseFetch();

    //############# Sockets en New Messages #########################

    useEffect(() => {

        socket.on('message', reseiveMessage);

        return () => {
            socket.off('message', reseiveMessage);
        }
    }, [socket]);

    const reseiveMessage = message => {

        if (message) {

            getMessages(message.conversationId)

            setMessages(preview => [...preview, message]); // Convertimos el conjunto en un array

            setActive(!active)

            reseiveMessage()
        }
    }

    //############# fetch data #########################

    const fetchData = async () => {

        handleLogin();

        const conversations = await getAllConversations(userId);

        const conversation = conversations.find((conv) => conv.Conversation.title === 'General');

        if (!conversation) {

            const idUsers = users?.map(user => user.id);
            console.log(idUsers)

            const body = {
                userId: userId,
                participantsId: idUsers,
                title: 'General'
            };

            createComversationGroup(body);
        }
    };

    const fetchData2 = async () => {

        const conversations = await getAllConversations(userId);

        const conversation = conversations.find((conv) => conv.Conversation.title === 'General');

        await setConversaId(conversation?.ConversationId);

        setConversations2(conversations);

        socket.emit('joinConversation', conversation?.ConversationId);

        getMessages(conversation?.ConversationId);
    };

    const fetchData3 = async () => {

        const conversations = await getAllConversations(userId);

        setConversations2(conversations);
    };

    useEffect(() => {

        fetchData();
        fetchData2();

    }, []);

    useEffect(() => {

        fetchData3();

    }, [active]);

    const checkConversationExists = async (userId, participantId) => {

        const conversations = await getAllConversations(userId);

        return conversations.some(conversation => {

            const participants = conversation.Conversation.Participants;

            const hasUser = participants.some(participant => 
                participant.UserId === userId 
                && conversation.Conversation.title !== 'General');

            const hasParticipant = participants.some(participant => 
                participant.UserId === participantId 
                && conversation.Conversation.title !== 'General');

            setConversaId(conversation.ConversationId)

            return hasUser && hasParticipant;
        });
    };

    const onSelectUser = async (participantId) => {
        
        const body = { userId, participantId };
        console.log(typeof userId)
        
        const conversationExists = await checkConversationExists(userId, participantId);

        if (!conversationExists) {
            console.log(body)
            if (userId == participantId) {

                setMessageNotice('No es posible crear una conversación contigo mismo');
                notice();
            } else {

                const newConversationId = await createConversation(body);
                setConversaId(newConversationId);
                await getAllConversations(userId);

                socket.emit('joinConversation', newConversationId);

                setActive(!active);

                getMessages(newConversationId)
            }
        } else {

            setMessageNotice(`Ya estás en una conversacion con este usuario`);
            notice();
        }
    };

    const getParticipantInfo = (participants) => {

        const id = localStorage.getItem('userId');
        const participant = participants?.filter(participant => participant.UserId !== id)[1];

        const info = {
            name: participant?.User?.firstname,
            avatar: participant?.User?.avatar
        };
        return info;
    };

    const handleMensajeChange = (event) => {
        setMensaje(event.target.value);
    };

    const handleSubmit = (event) => {

        event.preventDefault();

        const senderId = localStorage.getItem('userId');

        const mensajeData = {
            content: mensaje,
            senderId: senderId
        };

        const mensajeDataSocket = {
            content: mensaje,
            senderId: senderId,
            conversationId: conversaId
        };

        sendMessages(conversaId, mensajeData);

        const mensajeJSON = JSON.stringify(mensajeDataSocket);


        // Envía la cadena JSON al servidor
        socket.emit('message', mensajeJSON);

        setMensaje('');




        setActive(!active)



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
                            conversaId={conversaId}
                            setConversaId={setConversaId}
                            getMessages={getMessages}
                            getAllConversations={getAllConversations}
                        />
                    ))
                }

            </div>

            <div className='chat__container'>
                <div className='chat__lienzo'>
                    {
                        conversaId
                            ?
                            <ul className='ul__chat'>

                                <li>{messages?.map((message, i) => (

                                    <Messages
                                        key={i}
                                        message={message.content}
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