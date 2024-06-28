import { createContext, useContext, useEffect, useState } from "react";
import { createHashHistory } from 'history';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);
    const history = createHashHistory();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("user"));
        setUser(userInfo);

        if (!userInfo){
            history.push('/');
        }
    }, [history]);

    return <ChatContext.Provider value={{user, setUser, selectedChat, setSelectedChat, chats, setChats}}>
                {children}
            </ChatContext.Provider>
};

export const ChatState = () => {
    return useContext(ChatContext);
};

export default ChatProvider;