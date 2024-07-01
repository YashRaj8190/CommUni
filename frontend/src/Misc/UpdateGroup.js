import React, { useState } from 'react';
import axios from 'axios';
import { Box, FormControl, Input, useDisclosure } from "@chakra-ui/react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    IconButton,
    Button,
    useToast,
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { ChatState } from '../Context/chatProvider';
import UserBadgeItem from './UserBadgeItem';
import UserListItem from './UserListItem';

const UpdateGroup = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [load, setLoad] = useState(false);
    const [renameLoad, setRenameLoad] = useState(false);

    const toast = useToast();

    const { selectedChat, setSelectedChat, user } = ChatState();

    const handleRemove = async (u) => {
        if (selectedChat.groupAdmin._id === u._id) {
            toast({
                title: 'Admin can\'t be removed !!',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }
        if (selectedChat.groupAdmin._id !== user._id && u._id !== user.id) {
            toast({
                title: 'Only admins can remove members from the group!!',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }
        try {
            setLoad(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put('http://localhost:5000/api/chat/groupremove', {
                chatId: selectedChat._id,
                userId: u._id,
            }, config
            );
            u._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoad(false);
        } catch (error) {
            toast({
                title: 'Error occurred!!',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "top",
            });
        }
    };

    const handleAdd = async (userToAdd) => {
        if (selectedChat.users.find(u => u._id === userToAdd._id)) {
            toast({
                title: 'User already exists in group!!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }

        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: 'Only admins can add members in the group!!',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }
        try {
            setLoad(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put('http://localhost:5000/api/chat/groupadd', {
                chatId: selectedChat._id,
                userId: userToAdd._id,
            }, config
            );
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoad(false);
        } catch (error) {
            toast({
                title: 'Error occurred!!',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "top",
            });
        }
    };

    const handleRename = async () => {
        if (!groupChatName) return;
        try {
            setRenameLoad(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put('http://localhost:5000/api/chat/rename', {
                chatId: selectedChat._id,
                chatName: groupChatName,
            }, config);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoad(false);
        } catch (error) {
            toast({
                title: 'Error occurred!!',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            setRenameLoad(false);
        }
        setGroupChatName(" ");
    };

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) return;
        try {
            setLoad(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(`http://localhost:5000/api/user?search=${search}`, config);
            //console.log(data);
            setLoad(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: 'Error occurred!!',
                description: "Failed to load results",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "top",
            });
        }
    };

    return (
        <>
            <IconButton
                d={{ base: "flex" }}
                icon={<FontAwesomeIcon icon={faCog} />}
                onClick={onOpen}
            />

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{selectedChat.chatName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box
                            display="flex" flexWrap="wrap" w="100%" pb={3}
                            borderRadius="lg">
                            {selectedChat.users.map(u => (
                                <UserBadgeItem key={u._id} user={u} handleFunction={() => handleRemove(u)} />
                            ))}
                        </Box>
                        <FormControl display="flex">
                            <Input
                                placeholder="Group Name"
                                mb={3}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <Button
                                variant="solid" colorScheme="teal" ml={1} isLoading={renameLoad}
                                onClick={handleRename}
                            >
                                Update
                            </Button>
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder="Add new users"
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>

                        {load ? (
                            <div className='justify-center'>Loading ...</div>
                        ) : (
                            searchResult?.slice(0, 4).map(user => (
                                <UserListItem key={user._id} user={user} handleFunction={() => handleAdd(user)} />
                            ))
                        )}

                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' mr={3} onClick={() => handleRemove(user)}>
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateGroup;
