 // const handleBotonClic = async () => {
    //     try {

    //         await navigator.mediaDevices
    //             .getUserMedia({ audio: true, video: false })
    //             .then(async stream => {

    //                 audioRef.current.srcObject = stream
    //                 const conversations = await clienteApi.getAllConversations(userId)
    //                 const conversation = await conversations?.find((conv) => conv?.Conversation?.title === 'General');
    //                 const participants = conversation.Conversation.Participants

    //                 const participants2 = participants.filter(participant => participant.User.username !== username)
    //                 const usersCoonect = participants2.map(user => ({
    //                     username: user.User.username,
    //                     peer: new Peer()
    //                 }))

    //                 const peerUno = new Peer({
    //                     initiator: true,
    //                     stream
    //                 })

    //                 const configurePeerConnections = (usersConnect, peerUno) => {

    //                     usersConnect.forEach((user) => {
    //                         const peer = user.peer;
    //                         const username1 = user.username;

    //                         Cuando el usuario que transmite recibe una señal de un espectador
    //                         console.log(username1)
    //                         peerUno.on('signal', signal => {
    //                             envia una señal al servidor con el id de espectador
    //                             socket.emit('sending signal', { userToSignal: username1, callerUser: username, signal })
    //                             console.log(username1)
    //                         });

    //                         Cuando el usuario que transmite recibe una señal devuelta de un espectador

    //                         socket.on('receiving returned signal', payload => {

    //                          console.log(payload.username)
    //                                 ahora debe buscar la instancia peer correspondiente a este usuario

    //                                 Encuentra la instancia de Peer correspondiente a este usuario
    //                                 const existingPeer = usersConnect.find(user => user.username == payload.username);

    //                                 if (existingPeer) {
    //                                     Usa la instancia existente en lugar de crear una nueva
    //                                     existingPeer.peer.signal(payload.signal);
    //                                 }

    //                         });
    //                         Agrega la conexión al objeto connections
    //                         usersConnect[username1] = peer;

    //                         peer.on('stream', remoteStream => {
    //                             remoteAudio.current.srcObject = remoteStream;
    //                         });
    //                     });

    //                     return usersConnect;
    //                 }

    //                 peerUno.on('open', () => {
    //                     console.log('listo open')
    //                     configurePeerConnections(usersCoonect, peerUno);
    //                 });
    //                 peerUno.on('error', (error) => {
    //                     console.error('Error al inicializar Peer:', error);
    //                   });
    //             })

    //             Llama a esta función después de obtener el arreglo usersCoonect y la transmisión local

    //             .catch(err => console.log('hubo un error', err))

    //     } catch (error) {
    //         console.error('Error al intentar obtener acceso al micrófono:', error);
    //     }


    // };

    //##############################################################

    // const [audioRecorder, setAudioRecorder] = useState(null);
    // const [audioBlob, setAudioBlob] = useState(null); // Inicializado como `null`
    // const [audioIndex, setAudioIndex] = useState(null);


    //     const [grabaciones, setGrabaciones] = useState([]);

    //     const iniciarAudio = async () => {
    //       const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    //       const mediaRecorder = new MediaRecorder(mediaStream);
    //       const audioChunks = [];

    //       console.log('Se inició la grabación');

    //       mediaRecorder.ondataavailable = (event) => {
    //         if (event.data.size > 0) {
    //           audioChunks.push(event.data);
    //         }
    //       };

    //       mediaRecorder.onstop = () => {
    //         const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    //         setAudioBlob(audioBlob);

    //         // Agrega la grabación actual al arreglo de grabaciones
    //         setGrabaciones([...grabaciones, audioBlob]);
    //       };

    //       setAudioRecorder(mediaRecorder);

    //       audioChunks.length = 0;
    //       mediaRecorder.start();
    //     };

    //     const detenerAudio = () => {
    //       if (audioRecorder) {
    //         audioRecorder.stop();
    //       }

    //       console.log('Se detuvo la grabación');
    //     };
//######################################################################################







    // useEffect(() => {
    //     if (peer1) {
    //         peer1.on('signal', (data) => {
    //             socket.emit('signal', data);
    //         });
    //         socket.on('signal', (data) => {
    //             peer1.signal(data);
    //             console.log('Recibida la señal del receptor');
    //         });
    //     }
    // }, [peer1]);

    // useEffect(() => {
    //     if (peer1 && peer3) {
    //         const isPeer1Initiator = peer1.initiator;
    //         const startButton = document.getElementById('startButton');

    //         peer3.on('signal', data => {
    //             socket.emit('signal', data);
    //             console.log('en signal 3');
    //         });

    //         socket.on('signal', async (data) => {
    //             if (data && (data.type === 'answer' || data.type === 'offer')) {
    //                 console.log(`Signal desde peer1: ${data.type}`, data);

    //                 await startButton.addEventListener('click', () => {
    //                     console.log('se preciono boton')
    //                     if (data.type === 'offer') {
    //                         // Generar la respuesta del receptor (peer3) con la descripción de sesión de peer1
    //                         peer3.signal({ type: 'answer', sdp: data.sdp });
    //                     } else if (isPeer1Initiator) {
    //                         // Generar la oferta del receptor (peer3)
    //                         peer3.signal({ type: 'offer', sdp: data.sdp });
    //                     }
    //                 });
    //             }
    //         });
    //         console.log('se pasó el evento click')
    //         peer3.on('stream', remoteStream => {
    //             const videoElement = document.getElementById('remoteVideo');
    //             videoElement.srcObject = remoteStream;
    //             videoElement.play();
    //         });

    //         peer3.on('error', err => {
    //             console.error('Error en la configuración de peer3:', err);
    //         });
    //     }
    // }, [peer1, peer3]);
//######################################################################


    // const [audioContext, setAudioContext] = useState(null);
    //     const [mediaStream, setMediaStream] = useState(null);
    //     const [mediaRecorder, setMediaRecorder] = useState(null);
    //     const [audioChunks, setAudioChunks] = useState([]);
    //     const [isRecording, setIsRecording] = useState(false);


    //     const startRecording = async () => {
    //       const context = new AudioContext();
    //       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    //       const recorder = new MediaRecorder(stream, { mimeType: 'audio/ogg; codecs=opus' });
    //       recorder.ondataavailable = (event) => {
    //         if (event.data.size > 0) {
    //           setAudioChunks([...audioChunks, event.data]);
    //         }
    //       };

    //       recorder.onstop = () => {

    //         const audioBlob = new Blob(audioChunks, { type: 'audio/ogg; codecs=opus' });

    //         // Envía los datos de audio al servidor
    //         socket.emit('audioData', audioBlob);
    //         // Limpia los fragmentos de audio anteriores
    //         setAudioChunks([]);
    //       };





    //       setAudioContext(context);
    //       setMediaStream(stream);
    //       setMediaRecorder(recorder);

    //       recorder.start();
    //       setIsRecording(true);
    //     };

    //     const stopRecording = () => {
    //       if (mediaRecorder) {
    //         mediaRecorder.stop();
    //       }

    //       setIsRecording(false);
    //     };

    // peer2.on('signal', (data) => {
    //     socket.emit('signal', data);
    //     console.log('Signal desde peer2:', data);
    // });

    // peer2.on('stream', (remoteStream) => {
    //     console.log('Stream remoto recibido');
    //     remoteVideo.srcObject = remoteStream;
    // });

    // startButton.addEventListener('click', () => {
    //     // En este punto, la señal generada por peer1 ya se envió cuando se hizo clic en el botón
    //     console.log('Iniciar señalización');
    // });

    // navigator.mediaDevices.getUserMedia({
    //     video: true,
    //     audio: true
    // }).then(gotMedia).catch(() => {});

    // function gotMedia(stream) {
    //     var peer1 = new Peer({ initiator: true, stream: stream });
    //     var peer2 = new Peer();

    //     peer1.on('signal', data => {
    //         peer2.signal(data);
    //     });

    //     peer2.on('signal', data => {
    //         peer1.signal(data);
    //     });

    //     peer2.on('stream', stream => {
    //         // got remote video stream, now let's show it in a video tag
    //         var video = document.querySelector('video');

    //         if ('srcObject' in video) {
    //             video.srcObject = stream;
    //         } else {
    //             video.src = window.URL.createObjectURL(stream); // for older browsers
    //         }

    //         video.play();
    //     });
    // }




