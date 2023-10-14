import '../App.css'
const Notices = ({message}) => {
  
    return (
        <div className="container__modal">
            <div className="container__phrase">
                <img className='image__notice' src='/images/icons/error.png' alt="" />
                <h5 className="session__expired"> {message} </h5>
            </div>
            <img className='image__notice' src='/images/vite.svg' alt="" />
        </div>
    )
}

export default Notices