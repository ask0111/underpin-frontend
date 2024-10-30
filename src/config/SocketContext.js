// SocketContext.js
import React, { createContext, useContext } from 'react';
import { io } from 'socket.io-client';
import Cookies from "js-cookie";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const socket = io(process.env.REACT_APP_BACKEND_URL); // Create the socket instance

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

// Custom hook to use socket
export const useSocket = () => {
    return useContext(SocketContext);
};
