import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/chatProvider'
import { Box, FormControl, IconButton, Spinner, Text, useToast } from '@chakra-ui/react'
import { getSender, getSenderFull } from './config/chatLogic'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import UpdateGroup from './UpdateGroup'
import Profile from './Profile'
import axios from 'axios';
import ScrollableChat from './ScrollableChat';

const SingleChat = ({ fetchAgain, setFetchAgain }) => {

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState();

    const { user, selectedChat, setSelectedChat } = ChatState();
    const toast = useToast();

    const fetchMessages = async () => {
        if (!selectedChat)return;
        
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            setLoading(true);

            const {data} = await axios.get(`http://localhost:5000/api/message/${selectedChat._id}`, config);
            
            //console.log(messages);
            setMessages(data);
            console.log(messages);
            setLoading(false);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load Messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [selectedChat]);

    const sendMessage = async (e) => {
        if (e.key === "Enter" && newMessage){
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`, 
                    },
                };

                const {data} = await axios.post("http://localhost:5000/api/message/", 
                    {
                        content: newMessage,
                        chatId: selectedChat._id,
                    },
                    config
                );
                setNewMessage("");

                //console.log(data);
                setMessages([...messages, data]);
            } catch (error){
                toast({
                    title: "Error Occured!",
                    description: "Failed to send the Message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            };
        }
    }

    const typingHandler = (e) => {
        setNewMessage(e.target.value);
    };

    return (
        <>
            {selectedChat ? (
                <>
                    <Text pb={3} px={3} fontSize={{ base: "28px", md: "30px" }} fontFamily="Work sans" w="100%" display="flex" alignItems="center" justifyContent={{ base: "space-between" }}>
                        <IconButton
                            d={{ base: "flex", md: "none" }}
                            icon={<FontAwesomeIcon icon={faArrowLeft} />}
                            onClick={() => setSelectedChat("")}
                        />
                        {!selectedChat.isGroupChat ? (
                            <>
                                {getSender(user, selectedChat.users)}
                                <Profile user={getSenderFull(user, selectedChat.users)} />
                            </>
                        ) : (
                            <>
                                {selectedChat.chatName.toUpperCase()}
                                <UpdateGroup fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages}/>
                            </>
                        )}
                    </Text>
                    <Box
                        display="flex"
                        flexDir="column" justifyContent="flex-end" h="100%" w="100%" p={3}
                        bg="#E8E8E8"
                        borderRadius="lg" overflow="hidden">
                            {loading ? (
                                <Spinner
                                    size="xl"
                                    w={20}
                                    h={20}
                                    alignSelf="center"
                                    margin="auto"
                                ></Spinner>
                            ):(
                                <div style={{display:"flex", flexDirection: "column", overflowY: "scroll", scrollbarWidth: "none"}}>
                                    <ScrollableChat messages={messages}></ScrollableChat>
                                </div>
                            )}
                            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                                <input style={{backgroundColor: "#E0E0E0", width: "100%", padding: "10px"}} placeholder='Enter message' onChange={typingHandler} value={newMessage}></input>
                            </FormControl>
                    </Box>
                </>
            ) : (
                <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                    <Text pb={3} fontSize="3xl" fontFamily="Work sans">Click on a user to start chatting.....</Text>
                </Box>
            )}
        </>
    )
}

export default SingleChat;
