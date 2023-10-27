import io  from "socket.io-client";
let socket = null;
export const initWebSocket = () => {
    if (!socket) {
        socket = io('https://chatv1-0.onrender.com:8000/');
    
        socket.on('connect', () => {
          console.log('Conexión establecida con el servidor WebSocket');
        });
    
        
      }
    
      return socket;
};
