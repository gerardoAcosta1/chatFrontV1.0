

const EnttryCall = ({handleStartAudio, userEmit, EntryCall, setEntryCall}) => {

    const response = (res) => {
        if(res == 1){
            handleStartAudio();
            setEntryCall(false)

        }else {
            setEntryCall(false)
        }
    }

    return (

        <div className={`call__main ${!EntryCall ? 'call__main__hide' : ''}`}>
            <h4 className='call__message'>{userEmit} inició una transmisión en vivo, preciona aceptar para escucharla </h4>
            <div className='call__buttons__container'>
                <button className='call__acept' onClick={() => response(1)}><i class='bx bx-upvote bx-md'></i>Aceptar</button>
                <button className='call__decline' onClick={() => response(0)}><i class='bx bx-downvote bx-md'></i>No quiero escuchar</button>
            </div>
        </div>
    )
}

export default EnttryCall
