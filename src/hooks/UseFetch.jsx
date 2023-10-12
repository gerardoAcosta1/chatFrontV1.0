import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const UseFetch = () => {

    //const url = 'https://griffith-bandicoot-nmrz.2.sg-1.fl0.io';
    const url = 'http://localhost:8001'

    const [conversations, setConversation] = useState([]);
    const [messages, setMessages] = useState([]);

    const [converId, setConverId] = useState();

    let many = 1;

    const navigate = useNavigate()

//------------------------ Register User -------------------------------------

    const registerUser = (data, { setForm, modal }) => {

        axios
            .post(`${url}/api/v1/users`, data)
            .then(res => {
                console.log(res)
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

                localStorage.removeItem('token');
                localStorage.setItem('users', JSON.stringify(res.data));
                localStorage.setItem('token', res.data.token);
                handleLogin();
                navigate('/chat')

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
                
                setConverId(res.data)
                return res.data
            
            })
            .catch(err => console.log(err))
    };

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
            console.log(res.data)
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
            const { id: userId } = JSON.parse(localStorage.getItem('users'));
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
                    
                console.log(res.data)                
            })
            .catch(err => console.log(err))
    };
      
//------------------------- Returns -------------------------------------
        return { 
            registerUser,
            loginUser, 
            createConversation, 
            getAllConversations, 
            deleteConversationById, 
            sendMessages, getMessages, 
            conversations, messages, converId}
    }

    export default UseFetch