import { Box, Stack, Text, useToast } from "@chakra-ui/react";
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
        setLoggedUser(JSON.parse(localStorage.getItem('user')));
        fetchChats();
    }, [fetchAgain]);

    return (
        <Box
            display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
            flexDir="column"
            alignItems="center"
            p={3}
            bg="white"
            w={{ base: "100%", md: "31%" }}
            borderRadius="lg"
            borderWidth="1px"
        >
            <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
                My Chats
                <GroupChatModal>
                    <button style={{ display: "flex", padding: "10px", alignItems: "center" }}>
                        New Group Chat
                        <FontAwesomeIcon icon={faAdd}></FontAwesomeIcon>
                    </button>
                </GroupChatModal>
            </div>

            <div
                style={{ display: "flex", flexDirection: "column", padding: "10px", backgroundColor: "#F8F8F8", width: "100%", height: "100%", borderRadius: "lg", overflowY: "hidden" }}
            >
                {chats ? (
                    <Stack overflowY='scroll'>
                        {chats.map((chat) => (
                            <Box
                                onClick={() => setSelectedChat(chat)}
                                cursor="pointer"
                                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                                color={selectedChat === chat ? "white" : "black"}
                                px={3}
                                py={2}
                                borderRadius="lg"
                                key={chat._id}
                            >
                                <Text>
                                    {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                                </Text>
                            </Box>
                        ))}
                    </Stack>
                ) : (
                    <Loading></Loading>
                )}
            </div>
        </Box>
    );
};

export default MyChats;