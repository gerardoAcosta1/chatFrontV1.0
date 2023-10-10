import { useForm } from 'react-hook-form'
import '../styles/Home/RegisterLayout.css'
import UseFetch from '../../hooks/UseFetch'
import { useState } from 'react'

const RegisterLayout = ({ setForm }) => {
   
    const [ok, setOk] = useState(false)
    const modal = () => {
        setOk(!ok);
    }
    const { register, reset, handleSubmit } = useForm();

    const { registerUser } = UseFetch();

   

    const submit = data => {

        registerUser(data, { setForm, modal })
       
        reset({
            firstname: '',
            lastname: '',
            email: '',
            password: '',
        })
    }

    return (

        <div className="register__main">

            <form onSubmit={handleSubmit(submit)}>
                <div className="container__title__register">
                    <h3 className="singUp">Sing Up</h3>
                </div>

                <div className="container__register">
                    <div>
                        <label className="title__register" htmlFor="firstname">First Name</label>
                        <input className="input__register"{...register('firstname')} type="text" id="firstname" />
                    </div>
                    <div>
                        <label className="title__register" htmlFor="lastname">Last Name</label>
                        <input className="input__register"{...register('lastname')} type="text" id="lastname" />
                    </div>
                    <div>
                        <label className="title__register" htmlFor="email">Email</label>
                        <input className="input__register"{...register('email')} type="email" id="email" />
                    </div>
                    <div>
                        <label className="title__register" htmlFor="password">Password</label>
                        <input className="input__register"{...register('password')} type="password" id="password" />
                    </div>
                    <button className="button__register">Create User</button>
                </div>
            </form>

            <div className='container__pie__form'>
                <h4 className='title__button'>Ya tengo una cuenta </h4>
                <button className='button__login' onClick={setForm}>Entrar</button>
            </div>
            {
                ok
                ?
                <div className='modal__register'>
                    <h4 className='modal__title'>User regitered</h4>
                </div>
                :
                <h2></h2>
            }

        </div>
    )

}

export default RegisterLayout