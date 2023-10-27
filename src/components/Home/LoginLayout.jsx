import { useForm } from 'react-hook-form'
import '../styles/Home/LoginLayout.css'
import UseFetch from '../../hooks/UseFetch'

const LoginLayout = ({ setForm, handleLogin}) => {

    const { register, reset, handleSubmit } = useForm()

    
    const {clienteApi} = UseFetch();

    const submit = async data => {
        
       await clienteApi.loginUser(data,{handleLogin});

        localStorage.setItem('home', 'pass');
        reset({
            username: '',
            password: '',
        })
    }

    return (

        <div className="main__login">
            <form onSubmit={handleSubmit(submit)}>
                <div className="container__title__register">
                    <h3 className="singUp">Login</h3>
                </div>
                <div className="container__register">
                <div>
                        <label className="title__register" htmlFor="username">Username</label>
                        <input className="input__register"{...register('username')} type="text" id="username" />
                    </div>
                    <div>
                        <label className="title__register" htmlFor="password">Password</label>

                        <input className="input__register"{...register('password')} type="password" id="password" />
                    </div>
                    <button className="button__register">Login</button>
                </div>
            </form>
            <div className='container__pie__form'>
                <h4 className='title__button'>No tengo una cuenta </h4>
                <button className='button__login' onClick={setForm}>Registrarme</button>
            </div>
        </div>
    )
}

export default LoginLayout