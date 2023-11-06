import io  from "socket.io-client";
let socket = null;
export const initWebSocket = () => {
    if (!socket) {
        socket = io('https://griffith-bandicoot-nmrz.2.sg-1.fl0.io');
    
        socket.on('connect', () => {
          console.log('Conexión establecida con el servidor');
        });
    
        
      }
    
      return socket;
};
