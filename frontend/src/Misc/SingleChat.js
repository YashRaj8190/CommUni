import React from 'react'
import { ChatState } from '../Context/chatProvider'
import { Box, IconButton, Text } from '@chakra-ui/react'
import { getSender, getSenderFull } from './config/chatLogic'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import UpdateGroup from './UpdateGroup'
import Profile from './Profile'

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { user, selectedChat, setSelectedChat } = ChatState();
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
                                <UpdateGroup fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                            </>
                        )}
                    </Text>
                    <Box
                        display="flex"
                        flexDir="column" justifyContent="flex-end" h="100%" w="100%" p={3}
                        bg="#E8E8E8"
                        borderRadius="lg" overflow="hidden">

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
