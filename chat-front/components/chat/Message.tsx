export interface IMessage {
    content: string;
    timeSent: string;
    username: any;
}

export interface Props {
    message: IMessage;
    user: { id: string; name: string };
}

const Message = ({message, user}: Props) => {
    const isCurrentUser = message.username === user.name;
    const isChatGPT = message.username === "ChatGPT";

    return (
        <div className={`bg-${isCurrentUser ? 'blue-500' : (isChatGPT ? 'green' : 'gray-200')} rounded-lg p-3 m-3`}>
            <p className={`text-${isCurrentUser || isChatGPT ? 'white' : 'black'}`}>{message.content}</p>
            <p className={`text-${isCurrentUser || isChatGPT ? 'gray-300' : 'gray-600'}`}>{message.timeSent}</p>
            <p className={`text-${isCurrentUser || isChatGPT ? 'gray-300' : 'gray-600'}`}>{message.username}</p>
        </div>
    )
}

export default Message;