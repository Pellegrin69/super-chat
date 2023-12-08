"use client"
import '../globals.css';
import {useEffect, useState} from "react";
import {io} from "socket.io-client";
import SendMessage from "@/components/chat/SendMessage";
import Messages from "@/components/chat/Messages";
import AddUser from "@/components/chat/AddUser";
import {IMessage} from "@/components/chat/Message";

const socket = io("http://localhost:3000");

const Chat = () => {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [user, setUser] = useState({id: '', name: 'Anonymous'});
    const [targetLanguage, setTargetLanguage] = useState("");

    useEffect(() => {
        socket.on("connect", () => {
            console.log("connected");
        });

        socket.on("chat-message", (data) => {
            setMessages((msg) => [...msg, data] as any);
        });

        socket.on("get-user", (data) => {
            setUser(data)
        });

        // Supprimer les commentaires pour déconnecter le socket lorsqu'on quitte le composant
        // return () => {
        //     socket.disconnect();
        // };
    }, []);

    useEffect(() => {
        socket.on("chat-translate", (data) => {
            setMessages((prevMessages) => {
                return prevMessages.map((msg) =>
                    msg.timeSent === data.timeSent ? {...msg, content: data.message} : msg
                );
            });
        });
    }, [messages]);

    return (
        <div className="flex-1 p:2 sm:p-6 justify-between flex flex-col h-screen">
            <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
                <div className="relative flex items-center space-x-4">
                    <div className="flex flex-col leading-tight">
                        <div className="text-2xl mt-1 flex items-center">
                            <span className="text-gray-700 mr-3">My wonderful chat</span>
                        </div>
                        <span className="text-lg text-gray-600">The best you never had</span>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <select value={targetLanguage}
                            className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline-blue focus:border-blue-500"
                            onChange={(e) => setTargetLanguage(e.target.value)}>
                        <option value="">Select Language</option>
                        <option value="english">English</option>
                        <option value="spanish">Spanish</option>
                        <option value="chinese">Chinese</option>
                        <option value="arabic">Arabic</option>
                        <option value="russian">Russian</option>
                        <option value="german">German</option>
                        <option value="french">French</option>
                    </select>
                </div>
            </div>

            <div id="messages" className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
                <Messages socket={socket} messages={messages} user={user} targetLanguage={targetLanguage} />
            </div>

            <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
                <SendMessage socket={socket} user={user}/>
                <AddUser socket={socket} />
            </div>
        </div>
    );
};

export default Chat;
