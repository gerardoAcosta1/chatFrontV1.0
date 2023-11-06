import { useEffect, useRef, useState } from 'react';
import EnttryCall from '../../utils/EnttryCall';
import User from '../../components/Chat/User';
import '../styles/Chat/ChatPage.css';
import UseFetch from '../../hooks/UseFetch';
import Conversation from '../../components/Chat/Conversation';
import Messages from '../../components/Chat/Messages';
import { initWebSocket } from '../../utils/initWebSocket';
import functionsRender from '../../utils/functionsRender';
import Peer from 'simple-peer';
import ConsoleOutput from '../../components/shared/ConsoleOutput';
import global from 'global'
import * as process from "process";
global.process = process;


const ChatPage = ({ handleLogin, notice, setMessageNotice }) => {

    //################ Constantes #####################################

    const id = localStorage.getItem('userId');
    const userId = parseInt(id)
    const username = localStorage.getItem('username')
    //################ useStates #####################################
    const [mensaje, setMensaje] = useState('');
    const [conversaId, setConversaId] = useState(null);
    const [socket, setSocket] = useState(initWebSocket());
    const [entrante, setEntrante] = useState(false)
    const [mic, setMic] = useState(false)
    const [anfitriones, setAnfitriones] = useState([]);
    const [EntryCall, setEntryCall] = useState()
    const [userEmit, setUserEmit] = useState()
    //################ useRef's #####################################
    const audioRef = useRef();
    const remoteAudio = useRef()
    const peer1 = useRef(null);
    const chatLienzoRef = useRef(null);
    //################ fetch and functions #####################################
    const { functions } = functionsRender()

    const {
        clienteApi,
        conversations,
        messages
    } = UseFetch();


    //############# Sockets en New Messages #########################

    let vueltas = 1
    const handleBotonClic = async () => {

        if(vueltas == 1){
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                 video: false, audio: {
                    volume: 0.9, // Valor entre 0 y 1 para controlar la ganancia
                },
            });
            
            peer1.current = new Peer({
                initiator: true,
                stream,
                config: {
                    iceServers: [
                        { urls: 'stun:stun.l.google.com:19302' },
                        { urls: 'turn:your-turn-server.com', username: 'your-username', credential: 'your-password' }
                    ],
                    sdpTransform: (sdp) => {
                        // Puedes modificar la oferta/respuesta SDP aquí
                        // Por ejemplo, para configurar códecs, puedes agregar líneas como las siguientes:
                        sdp = sdp.replace('opus/48000/2', 'ISAC/16000/1'); // Cambiar códec de audio de Opus a ISAC
                        sdp = sdp.replace('VP8/90000', 'H264/90000'); // Cambiar códec de video de VP8 a H.264
                        return sdp;
                    }
                }
            });

            peer1.current.on('signal', data => {
                console.log('Señal del anfitrión generada', data);
                socket.emit('anfitrionSignal', { signal: data, user: username });
                setAnfitriones(peer1.current);
            });

            socket.on('invitadoSignal', invitadoSignal => {
                if (invitadoSignal.user != username) {
                    peer1.current.signal(invitadoSignal.signal);
                }
            });
        vueltas++
        } catch (error) {
            console.error('Error al intentar obtener acceso al micrófono:', error);
        }
    }else{
        peer1.destroy()
        setUserEmit('')
        vueltas=1
    }
    };
    useEffect(() => {

        const peer2 = new Peer(
            {
                config: {
                    iceServers: [
                        { urls: 'stun:stun.l.google.com:19302' },
                        { urls: 'turn:your-turn-server.com', username: 'your-username', credential: 'your-password' }
                    ],
                    sdpTransform: (sdp) => {
                        // Puedes modificar la oferta/respuesta SDP aquí
                        // Por ejemplo, para configurar códecs, puedes agregar líneas como las siguientes:
                        sdp = sdp.replace('opus/48000/2', 'ISAC/16000/1'); // Cambiar códec de audio de Opus a ISAC
                        sdp = sdp.replace('VP8/90000', 'H264/90000'); // Cambiar códec de video de VP8 a H.264
                        return sdp;
                    }
                }
            }
        );

        peer2.on('signal', (invitadoSignal) => {
            console.log('Señal del invitado generada', invitadoSignal);
            socket.emit('invitadoSignal', { signal: invitadoSignal, user: username });
        });

        socket.on('anfitrionSignal', (anfitrionSignal) => {
            // Procesar la señalización del anfitrión
            if (anfitrionSignal.user != username) {
                setUserEmit(anfitrionSignal.user)
                console.log(userEmit)
                peer2.signal(anfitrionSignal.signal);
            }
        });

        peer2.on('stream', remoteStream => {
            console.log('Se conectó el audio', remoteStream);
            remoteAudio.current.srcObject = remoteStream;
            remoteAudio.current.play();
            console.log('¿Audio remoto en pausa?', remoteAudio.current.paused);
            console.log(peer2)
            setEntryCall(true)
        });


    }, [anfitriones]);
   
    const handleStartAudio = () => {
        console.log('¿Audio remoto en pausa?', remoteAudio.current.paused);
        if (remoteAudio.current.paused) {

            remoteAudio.current.play()
                .then(res => console.log('comunicacion iniciada'))
                .catch(error => {
                    console.error("Error al reproducir el audio remoto:", error);
                });
            console.log('¿Audio remoto en pausa?', remoteAudio.current.paused);
        }
    };


    useEffect(() => {

        functions.scrollToBottom(chatLienzoRef)

    }, [messages]);

    useEffect(() => {

        if (!conversaId) {
            console.log('conversaId es undefined');
        } else {
            clienteApi.getMessages(conversaId);
            clienteApi.getAllConversations(userId)
        }
        setEntrante(false);
    }, [entrante, conversaId]);

    useEffect(() => {

        handleLogin()

        fetchData()
    }, []);

    useEffect(() => {
        socket.on('message', reseiveMessage);
        socket.on('newConversation', newConversation);

        return () => {
            socket.off('message', reseiveMessage);
            socket.off('newConversation', newConversation);
        };
    }, [socket]);
  
    const newConversation = async () => {
        setEntrante(true)
        const conversations = await clienteApi.getAllConversations(userId)
        await clienteApi.setConversation(conversations)

        setEntrante(true)
    }

    let lastServerMessage = null;
    let num = 1
    const reseiveMessage = async (message, from) => {

        if (message.Sender == 'server' && message !== lastServerMessage && from == username) {
            lastServerMessage = message;
            console.log(message)
            await clienteApi.sendMessages(message.ConversationId, message);
            clienteApi.setMessages(preview => [message, ...preview]);
            await setEntrante(true)
        }
        if (message.Sender == 'server1' && message !== lastServerMessage && from == username) {
            lastServerMessage = message;
            console.log(message)
            await clienteApi.sendMessages(message.ConversationId, message);
            clienteApi.setMessages(preview => [message, ...preview]);
            await setEntrante(true)
        }
        if (message.Sender != 'server' && num < 1) {
            console.log('Se recibió el mensaje: reseived', message);
            console.log('Current messages', messages);
            await clienteApi.getMessages(conversaId);
            clienteApi.setMessages(preview => [message, ...preview]);
            await setEntrante(true);
            num++
        } else {
            num = 1
            await setEntrante(true);
        }

    };

    //############# fetch data #########################

    const fetchData = async () => {
        await handleLogin();
        const conversation = await conversations?.find((conv) => conv?.Conversation?.title === 'General');
       
        if (!conversation) {
            const users = await clienteApi.getUsers();
            const idUsers = await users?.map(user => user?.id);
            if (users) {
                const body = {
                    participantIds: idUsers,
                    title: 'General'
                };

                const newGeneral = await clienteApi.createComversationGroup(body, userId);

                if (newGeneral) {
                    console.log('newGeneral.id:', newGeneral.id);
                    setConversaId(newGeneral.id);
                    socket.emit('joinConversation', newGeneral.id, username, userId);
                } else {
                    console.log('newGenerales undefined', newGeneral);
                }
            }
        } else {
            if (conversation.Conversation.id) {
                console.log('conversation.Conversation.id:', conversation.Conversation.id);
                await setConversaId(conversation.Conversation.id);
                await clienteApi.getMessages(conversation.Conversation.id);
                socket.emit('joinConversation', conversation.Conversation.id, username, userId);
            } else {
                console.log('conversation.id es undefined', conversation);
            }
        }
        audioRef.current.play();
    };

    const onSelectUser = async (participantId) => {

        const body = {
            usersId: [userId, participantId]
        }

        const conversationExists = await functions.checkConversationExists(userId, participantId, conversations);

        if (!conversationExists) {

            if (userId == participantId) {

                setMessageNotice('No es posible crear una conversación contigo mismo');
                notice();

            } else {

                const newConversation = await clienteApi.createConversation(body, userId);

                setConversaId(newConversation.id);
                setEntrante(true)

                socket.emit('joinConversation', newConversation.id, username, userId);
                await clienteApi.getAllConversations(userId)

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

        if (mensaje == '!trivia' || mensaje == '!stop') {
            socket.emit('trivia', mensaje)
            setMensaje('');
        } else {

            event.preventDefault();

            const mensajeDataSocket = {
                content: mensaje,
                SenderId: userId,
                Sender: username,
                ConversationId: conversaId
            };

            const mensajeJSON = JSON.stringify(mensajeDataSocket);

            socket.emit('message', mensajeJSON, username);

            setEntrante(true)

            setMensaje('');
        }

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



            <div className='chat__container' id='scroll'>
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
                {

                    <EnttryCall
                        EntryCall={EntryCall}
                        setEntryCall={setEntryCall}
                        userEmit={userEmit}
                        handleStartAudio={handleStartAudio}
                    />
                }
                    
                <div className='chat__lienzo' id='scroll' ref={chatLienzoRef}>

                    {
                        conversaId && messages.length > 0
                            ?
                            <ul className='ul__chat ' id='scroll'>

                                <li >{messages?.map((message, i) => (

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
                     <ConsoleOutput />
            <div>
    
     

    </div>
                    <audio ref={audioRef} id='localAudio' src='/sounds/ircap_notice.mp3'></audio>

                    <audio ref={remoteAudio} id='remoteAudio' autoPlay playsInline></audio>

                 
        
                </div>

                <form className='chat__container__input' onSubmit={handleSubmit}>
                    <input className='chat__input' type="text" placeholder="Escribe tu mensaje"
                        value={mensaje}
                        onChange={handleMensajeChange} />
                    <button className='chat__send' type='submit'><i class='bx bx-send bx-sm'></i></button>

                    {
                        mic ? (
                            <i

                                className={`bx bx-microphone bx-md active`}
                            ></i>
                        ) : (
                            <i

                                className={`bx bx-microphone-off bx-sm ${mic ? 'active' : ''}`}
                            ></i>
                        )
                    }
                    <i onClick={handleBotonClic} class='bx bx-camera-home bx-sm'></i>
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
                                userEmit={userEmit}
                            />
                        );
                    })
                }

            </div>



        </div>
    )
}

export default ChatPage