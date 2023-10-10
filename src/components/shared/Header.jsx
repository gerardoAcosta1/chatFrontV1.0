import '../styles/Header.css'

const Header = ({login}) => {
    return (
        <div className='main__header'>
            <img className='image__logo' src="/images/logo.png" alt="" />
            <h4 className='title__logo'>Chat <h6> V1.0</h6></h4>

            <div className='container__logo__right'>
            <img className={`user__logo ${login ? 'logo__connect': 'logo__disconnect'}`} src="/images/user.png" alt="" />
            
            <h6 className={`${login ? 'connect': 'disconnect'}`}>{login ? "Connect" : "Disconnect"}</h6>
            </div>
           
        </div>
    )
}
export default Header