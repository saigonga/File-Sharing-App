import { createContext,useContext,useEffect,useRef,useState } from "react";
import { io } from "socket.io-client";

const SocketContext=createContext(null);

export const useSocket =() =>useContext(SocketContext);

export const SocketProvider=({children }) =>{
const socketRef=useRef();
const [isReady, setIsReady] = useState(false);

useEffect(()=>{
    socketRef.current=io("https://file-sharing-app-backend-4gwm.onrender.com");
    socketRef.current.on("connect", () => setIsReady(true));
    return () =>{
        socketRef.current.disconnect();
    }
},[]);

return (
    <SocketContext.Provider value={isReady ? socketRef.current : null}>
        {children}
    </SocketContext.Provider>
)
}