"use client";
import {Socket} from "socket.io-client";
import React, {useState} from "react";
import {IMessage} from "@/components/chat/Message";

export interface Props {
    socket: Socket;
    message: string;
}

const ValidateMessage = ({socket, message}: Props) => {
    const [validationResult, setValidationResult] = useState<string | null>(null);

    const handleValidateMessage = async () => {
        try {
            const result = await fetchValidationResult();
            setValidationResult(result);
        } catch (error: any) {
            console.error("Error validating message:", error.message);
            setValidationResult(`An error occured during the validation of the message : ${error.message}`);
        }
    };

    const fetchValidationResult = async () => {
        return new Promise<string>((resolve, reject) => {
            socket.emit("validate-message", {message});

            socket.on("validation-result", (data) => {
                resolve(data);
            });

            socket.on("validation-error", (error) => {
                reject(new Error(error.message));
            });
        });
    };

    return (
        <div>
            <button className="text-green-500 cursor-pointer"  onClick={handleValidateMessage}>
                Validate
            </button>
            {validationResult && <p>{validationResult}</p>}
        </div>
    );
};

export default ValidateMessage;
