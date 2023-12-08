"use client";
import {Socket} from "socket.io-client";
import React, {useState} from "react";

export interface Props {
    socket: Socket;
    message: string;
    timeSent: any;
    targetLanguage: string;
}

const TranslateMessage = ({socket, message, timeSent, targetLanguage}: Props) => {

    const handleSubmit = async () => {
        if (!targetLanguage || targetLanguage === '') {
            // Afficher un message d'erreur ou prendre toute autre action appropriée
            console.error("Veuillez sélectionner une langue avant de traduire.");
            return;
        }
        try {
            socket.emit('chat-translate', {
                message: message,
                timeSent: timeSent,
                targetLanguage,
            });
        } catch (error: any) {
            console.error(`Error sending translated message: ${error.message}`);
        }
    };

    return (
        <button className="text-blue-500 cursor-pointer" onClick={handleSubmit} type="button">Translate</button>
    );
};

export default TranslateMessage;
