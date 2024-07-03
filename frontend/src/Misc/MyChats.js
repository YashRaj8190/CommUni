import { useToast } from "@chakra-ui/react";
import { ChatState } from "../Context/chatProvider";
import axios from "axios";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import Loading from "./Loading";
import { getSender } from "./config/chatLogic";
import GroupChatModal from "./GroupChatModal";

const MyChats = ({ fetchAgain }) => {

    const [loggedUser, setLoggedUser] = useState();
    const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
    const toast = useToast();

    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get("http://localhost:5000/api/chat", config);
            //console.log(data);
            setChats(data);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load chats",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };

    useEffect(() => {
        if (selectedChat) {
            const interval = setInterval(fetchChats, 5000);
            return () => clearInterval(interval);
        }
    }, [selectedChat]);

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem('user')));
        fetchChats();
    }, [fetchAgain]);

    return (
        <div className="flex flex-col items-center p-3 w-full md:w-1/3 rounded-lg border border-gray-300 text-white" >
            <div className="flex justify-between items-center w-full mx-2 mb-2 pl-2 font-bold">
                My Chats
                <GroupChatModal>
                    <button className="flex items-center px-4 py-2 hover:bg-slate-700 hover:text-white rounded-lg">
                        New Group Chat
                        <span className="ml-3">
                            <FontAwesomeIcon icon={faAdd} />
                        </span>
                    </button>
                </GroupChatModal>
            </div>

            <div className="flex flex-col p-4 pr-2 bg-slate-700 w-full h-full rounded-lg overflow-hidden">
                {chats ? (
                    <div className="overflow-y-scroll">
                        {chats.map((chat) => (
                            <div
                                key={chat._id}
                                onClick={() => setSelectedChat(chat)}
                                className={`cursor-pointer px-3 py-2  rounded-lg mb-2 mr-2 ${selectedChat === chat ? "bg-green-400 text-white" : "bg-gray-100 text-black"
                                    }`}>
                                <div className="font-bold">
                                    {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                                </div>
                                {chat.latestMessage && chat.latestMessage.content && (
                                    <div className={`text-sm ${selectedChat === chat ? "text-white" : "text-gray-500"}`}>
                                        {!chat.isGroupChat && (
                                            <>
                                                {chat.latestMessage.sender.name === user.name ? (
                                                    <b>You : </b>
                                                ) : (
                                                    <b> </b>
                                                )}
                                            </>
                                        )}
                                        {chat.isGroupChat && (
                                            <>
                                                {chat.latestMessage.sender.name === user.name ?
                                                    (<b>You : </b>) : (<b>{chat.latestMessage.sender.name} : </b>)
                                                }
                                            </>
                                        )}
                                        {chat.latestMessage.content.length > 30 ?
                                            `${chat.latestMessage.content.substring(0, 30)}.....` :
                                            chat.latestMessage.content}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <Loading />
                )}
            </div>
        </div>
    );
};

export default MyChats;