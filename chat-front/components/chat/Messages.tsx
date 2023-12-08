import Message, {IMessage} from "./Message";
import ValidateMessage from "@/components/chat/ValidateMessage";
import {Socket} from "socket.io-client";
import TranslateMessage from "@/components/chat/TranslateMessage";

export interface Props {
    socket: Socket;
    messages: IMessage[];
    user: { id: string; name: string };
    targetLanguage: string;
}

const Messages = ({socket, messages, user, targetLanguage}: Props) => {
    return (
        <div className="chat-message">
            {messages.map((msg, i) => {
                if (msg.username === "ChatGPT") {
                    return (
                        <div key={msg.timeSent}
                             className={`flex flex-col ${msg.username === user.name ? 'items-end' : 'items-start'}`}>
                            <Message message={msg} user={user}/>

                        </div>
                    );
                } else {
                    return (
                        <div key={msg.timeSent}
                             className={`flex flex-col ${msg.username === user.name ? 'items-end' : 'items-start'}`}>
                            <Message message={msg} user={user}/>

                            <div className="flex space-x-2 mx-3">
                                <TranslateMessage socket={socket} message={msg.content} timeSent={msg.timeSent}
                                                  targetLanguage={targetLanguage}/>
                                <ValidateMessage socket={socket} message={msg.content}/>
                            </div>
                        </div>
                    );
                }
            })}
        </div>
    );
};

export default Messages;
