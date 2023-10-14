import io  from "socket.io-client";
let socket = null;
export const initWebSocket = () => {
    if (!socket) {
        socket = io('http://localhost:8001');
    
        socket.on('connect', () => {
          console.log('Conexión establecida con el servidor WebSocket');
        });
    
        
      }
    
      return socket;
};
