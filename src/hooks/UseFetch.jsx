import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const UseFetch = () => {

    //const url = 'https://griffith-bandicoot-nmrz.2.sg-1.fl0.io';
    const url = 'http://localhost:8001'

    const [conversations, setConversation] = useState([]);
    const [messages, setMessages] = useState([]);

    const navigate = useNavigate()

//------------------------ Register User -------------------------------------

    const registerUser = (data, { setForm, modal }) => {

        axios
            .post(`${url}/api/v1/users`, data)
            .then(res => {
                console.log(res)
                console.log('hola')
                modal()
                setTimeout(() => {
                    setForm()
                }, 1000);
                setTimeout(() => {
                    modal()
                }, 2000);

            })
            .catch(err => console.log(err))
    };

//------------------------- Login User ------------------------------------

    const loginUser = (data, { handleLogin }) => {

        axios
            .post(`${url}/api/v1/users/login`, data)
            .then(res => {
              const userId = res.data.id; 
              localStorage.setItem('userId', userId);
              const user = res.data;
              const userKey = `user_${user.id}`;
              localStorage.setItem(userKey, JSON.stringify(user));
              localStorage.setItem('token', user.token);
              handleLogin();
              navigate('/chat');

            })
            .catch(err => console.log(err))
    };

//------------------------ Create Conversation ------------------------------------

    const createConversation = (body) => {
        const token = localStorage.getItem('token')
        
       return axios
            .post(`${url}/api/v1/conversations`, body, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(res => {
                
              console.log(res.data)

              return res.data
            
            })
            .catch(err => {
              console.log(err);
              throw err; // Rechazar la promesa para manejar errores en el lugar donde se llama
            });
            
    };

    const createComversationGroup = body => {
      const token = localStorage.getItem('token')
        
       return axios
            .post(`${url}/api/v1/conversations/group`, body, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(res => {
                
               console.log(res.data)
            
            })
            .catch(err => console.log(err))
    }

//------------------------ Get ALL Conversations ---------------------------------

    const getAllConversations = (userId) => {
        const token = localStorage.getItem('token');
        return axios
          .get(`${url}/api/v1/conversations/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then(res => {
    
            setConversation(res.data)
            return res.data;
          })
          .catch(err => {
            console.log(err);
            throw err; // Rechazar la promesa para manejar errores en el lugar donde se llama
          });
      };

//---------------------- Delete a Conversation by Id --------------------------------

    const deleteConversationById = (id) => {
        const token = localStorage.getItem('token');
      
        const options = {
          method: 'DELETE',
          url: `${url}/api/v1/conversations/${id}`,
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
      
        axios(options)
          .then(res => {
            const  userId  = localStorage.getItem('userId');
            getAllConversations(userId)
            getAllConversations(userId)
            console.log(res.data);
          })
          .catch(err => console.error(err));
          
      };

//------------------------- Sed Messages -----------------------------------

      const sendMessages = (id, body) => {

        const token = localStorage.getItem('token');
        // Configura las opciones de la solicitud, incluyendo las cabeceras de autorización
        const options = {
          method: 'POST', // Cambia el método HTTP a DELETE
          url: `${url}/api/v1/messages/conversation/${id}`, 
          data: body, 
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        };
      
        axios(options)
          .then(res => {
         
            return res.data
          })
          .catch(err => console.error(err));
      };

//-------------------------- Get Messages --------------------------------

      const getMessages = id => {
        const token = localStorage.getItem('token');
       return axios
            .get(`${url}/api/v1/messages/conversation/${id}`,{
                headers: {
                  Authorization: `Bearer ${token}`
                }
              } )
            .then(res => {
              
                    setMessages(res.data)
                    
                       
            })
            .catch(err => console.log(err))
    };
      
//------------------------- Returns -------------------------------------
        return { 
            registerUser,
            loginUser, 
            createConversation,
            createComversationGroup, 
            getAllConversations, 
            deleteConversationById, 
            sendMessages, getMessages,
            setMessages, 
            conversations, messages,}
    }

    export default UseFetch