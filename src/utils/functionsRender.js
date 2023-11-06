
const functionsRender = () => {
    const userId = localStorage.getItem('userId')

    class render {

        getParticipantInfo(participants){
            
            const id = userId
            const participant = participants?.filter(participant => participant?.UserId !== id)[1];
    
            const info = {
                name: participant?.User?.firstname,
                avatar: participant?.User?.avatar
            };
            return info;
        };

        checkConversationExists = async (userId, participantId, conversations) => {

            return conversations?.some(conversation => {
                
                const participants = conversation.Conversation.Participants;
             
                const hasUser = participants.some(participant =>
                    participant.UserId === userId
                    && conversation.Conversation.title !== 'General');
    
                const hasParticipant = participants.some(participant =>
                    participant.UserId === participantId
                    && conversation.Conversation.title !== 'General');
              
                return hasUser && hasParticipant;
            });
        };

        scrollToBottom = (ref) => {
            if (ref.current) {
              ref.current.scrollTop = ref.current.scrollHeight;
            }
          };
    }

    const functions = new render();

    return {functions}

}

export default functionsRender