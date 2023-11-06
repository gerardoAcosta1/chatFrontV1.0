import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const UseFetch = () => {

  //const url = 'https://griffith-bandicoot-nmrz.2.sg-1.fl0.io';
  const url = 'https://chatv1-0.onrender.com/'

  const [conversations, setConversation] = useState([]);
  const [messages, setMessages] = useState([]);

  const navigate = useNavigate()

  class QuerysDB {

    constructor(url) {
      this.token = localStorage.getItem('token');
      this.conversations = conversations;
      this.messages = messages
      this.setMessages = setMessages
      this.url = url
      this.setConversation = setConversation
    }

    async makeRequest(url, data, config = {}) {
      try {
        const response = await axios(url, {
          ...config,
          method: config.method || 'get', // Agregamos el método por defecto 'get'
          headers: {
            Authorization: `Bearer ${this.token}`,
            ...(config.headers || {}),
          },
          data,
        });

        return response.data;

      } catch (error) {
        console.log(error)

        return error
      }
    };

    async getUsers() {
      const response = await this.makeRequest(`${url}/users/`, { method: 'get' });

      return response
    };

    async registerUser(data, { setForm, modal }) {
      await this.makeRequest(`${url}/users/`, data, { method: 'post' });
      modal();
      setTimeout(() => setForm(), 1000);
      setTimeout(() => modal(), 2000);
    };

    async loginUser(data) {
      try {
        const response = await this.makeRequest(`${url}/users/login/`, data, { method: 'post' });
        const userId = response.id;
        if (response.data && response.data.token) {
          const token = response.data.token;
          // Ahora puedes almacenar el token y usarlo
        } else {
          alert("El token no está presente en la respuesta");
        }
        
        localStorage.setItem('username', response.username)
        localStorage.setItem('userId', userId);
        const userKey = `user_${userId}`;
        localStorage.setItem(userKey, JSON.stringify(response));
        await localStorage.setItem('token', response.token);

        navigate('/chat');
      } catch (error) {
        alert(JSON.stringify(error))
      }

    };

    async createConversation(body, id) {
      const response = await this.makeRequest(`${url}/conversations/private/`, body, { method: 'post' });
      await setConversation(preview => [...preview, response])
      await this.getAllConversations(id)
      await this.getMessages(response.id)
      return response
    };

    async createComversationGroup(body, id) {
      try {
        const response = await axios.post(`${url}/conversations/groups/`, body, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        this.getAllConversations(id)
        return response.data
      }
      catch (error) {
        console.log(error)
      }
    };

    async getAllConversations(id) {
      const response = await this.makeRequest(`${url}/conversations/${id}`);
      if (response) {
        setConversation(response);
      }
      return response;
    };

    async deleteConversationById(id) {
      await this.makeRequest(`${url}/conversations/${id}`, null, { method: 'delete' });
      const userId = localStorage.getItem('userId');
      console.log('Deleted conversation:', id);
      this.getAllConversations(userId)
    };

    async sendMessages(id, body) {
      try {
        const response = await this.makeRequest(`${url}/messages/${id}`, body, { method: 'post' });

        this.getMessages(id)
        return response
      } catch (error) {
        console.log(error)
      }
    };

    async getMessages(id) {

      try {
        const response = await this.makeRequest(`${url}/messages/${id}`);

        if(Array.isArray(response)){
          await setMessages(response);
          
          return response
        }else{
          return []
          console.log(response)
        }
      } catch (error) {
        console.log(error)
        return []
      }

    };
  }
  const clienteApi = new QuerysDB();


  //------------------------- Returns -------------------------------------
  return {
    clienteApi,
    conversations,
    messages,
    setConversation
  }
}

export default UseFetch