import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/chatProvider'
import { Box, IconButton, Spinner, Text, useToast } from '@chakra-ui/react'
import { getSender, getSenderFull } from './config/chatLogic'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import UpdateGroup from './UpdateGroup'
import Profile from './Profile'
import axios from 'axios';
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client';

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState();
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();
    const toast = useToast();

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            setLoading(true);

            const { data } = await axios.get(`http://localhost:5000/api/message/${selectedChat._id}`, config);

            //console.log(messages);
            setMessages(data);
            setLoading(false);

            socket.emit('join chat', selectedChat._id);
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
        socket = io(ENDPOINT);
        socket.emit('setup', user);
        socket.on('connected', () => setSocketConnected(true));
        socket.on('typing', () => setIsTyping(true));
        socket.on('stop typing', () => setIsTyping(false));
    }, []);

    useEffect(() => {
        fetchMessages();

        selectedChatCompare = selectedChat;
    }, [selectedChat]);

    // console.log(notification);
    useEffect(() => {
        socket.on('message recieved', (newMessageRecieved) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
                if (!notification.includes(newMessageRecieved)) {
                    setNotification([newMessageRecieved, ...notification]);
                    setFetchAgain(!fetchAgain);
                }
            } else {
                setMessages([...messages, newMessageRecieved]);
            }
        });
    });

    const sendMessage = async (e) => {
        if (e.key === "Enter" && newMessage) {
            socket.emit('stop typing', selectedChat._id);
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };

                const { data } = await axios.post("http://localhost:5000/api/message/",
                    {
                        content: newMessage,
                        chatId: selectedChat._id,
                    },
                    config
                );
                setNewMessage("");

                //console.log(data);

                socket.emit('new message', data);
                setMessages([...messages, data]);
            } catch (error) {
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

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit('typing', selectedChat._id);
        }

        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;

            if (timeDiff >= timerLength && typing) {
                socket.emit('stop typing', selectedChat._id);
                setTyping(false);
            }
        }, timerLength)
    };

    return (
        <>
            {selectedChat ? (
                <>
                    <div className="pb-2 px-3 text-lg md:text-xl  font-semibold font-WorkSans w-full flex items-center justify-between">
                        {!selectedChat.isGroupChat ? (
                            <>
                                <div className="flex items-center text-white">
                                    <Profile user={getSenderFull(user, selectedChat.users)} />
                                    <div className="px-4 text-2xl">
                                        {getSender(user, selectedChat.users)}
                                    </div>
                                </div>
                                <IconButton
                                    d={{ base: "flex", md: "none" }}
                                    icon={<FontAwesomeIcon icon={faTimes} />}
                                    onClick={() => setSelectedChat("")}
                                />
                            </>
                        ) : (
                            <>
                                <IconButton
                                    d={{ base: "flex", md: "none" }}
                                    icon={<FontAwesomeIcon icon={faArrowLeft} />}
                                    onClick={() => setSelectedChat("")}
                                />
                                <span className='text-white'>
                                    {selectedChat.chatName.toUpperCase()}
                                </span>
                                <UpdateGroup fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} />
                            </>
                        )}
                    </div>
                    <Box
                        display="flex"
                        flexDir="column" justifyContent="flex-end" h="90%" w="100%" p={3}
                        bg="#2a3646"
                        borderRadius="lg" overflow="hidden">
                        {loading ? (
                            <Spinner
                                size="xl"
                                w={20}
                                h={20}
                                alignSelf="center"
                                margin="auto"
                            ></Spinner>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", overflowY: "scroll", scrollbarWidth: "none" }}>
                                <ScrollableChat messages={messages}></ScrollableChat>
                            </div>
                        )}
                        <div className="mt-3">
                            {isTyping && <div className='text-white'>Typing...</div>}
                            <input
                                className="w-full py-2 px-3 bg-gray-100 rounded-lg"
                                placeholder="Enter message"
                                onChange={typingHandler}
                                onKeyDown={sendMessage}
                                value={newMessage}
                            />
                        </div>
                    </Box>
                </>
            ) : (
                <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                    <Text pb={3} fontSize="3xl" fontFamily="Work sans" color="white">Click on a user to start chatting .....</Text>
                </Box>
            )}
        </>
    )
}

export default SingleChat;
