import { useState } from 'react';
import LoginLayout from '../../components/Home/LoginLayout.jsx';
import RegisterLayout from '../../components/Home/RegisterLayout.jsx';
import '../styles/Home/HomePage.css'

const HomePage = ({handleLogin}) => {

    const [register, setRegister] = useState(false);
    
    
    const setForm  = () => {
        setRegister(!register)
    }
    
    return (

        <div className="main__home">
             
            <section className='dates__home'>
                {
                    register
                        ?
                        <RegisterLayout setForm={setForm}/>
                        :
                        <LoginLayout 
                        setForm={setForm}
                        handleLogin={handleLogin}
                       
                        />
                }
            </section>
        </div>
    )
}

export default HomePage