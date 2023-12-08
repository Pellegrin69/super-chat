"use client";
import {Socket} from "socket.io-client";
import React, {useState} from "react";

export interface Props {
    socket: Socket;
}

const AddUser = ({socket}: Props) => {
    const [username, setUsername] = useState("")

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (username === "ChatGPT")
            return console.error("This nickname is reserved.")
        socket.emit("add-user", {
            username: username,
        });

        setUsername("");
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}/>
            <button type="submit">Set username</button>
        </form>
    )
}

export default AddUser;