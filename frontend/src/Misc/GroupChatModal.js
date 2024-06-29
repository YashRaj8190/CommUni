import React, { useState } from 'react';
import { Box, FormControl, Input, useDisclosure } from "@chakra-ui/react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useToast
} from '@chakra-ui/react';
import { ChatState } from '../Context/chatProvider';
import axios from 'axios';
import UserBadgeItem from './UserBadgeItem';
import UserListItem from './UserListItem';

const GroupChatModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [load, setLoad] = useState(false);

    const toast = useToast();
    const { user, chats, setChats } = ChatState();

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        }
        try {
            setLoad(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(`http://localhost:5000/api/user?search=${query}`, config);
            console.log(data);
            setLoad(false);
            setSearchResult(data);

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

    const handleSubmit = async () => {
        if (!groupChatName || selectedUsers.length === 0) {
            toast({
                title: 'Please fill all the fields!!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post("http://localhost:5000/api/chat/group", {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map((u) => u._id)),
            }, config);
            setChats([data, ...chats]);
            onClose();
            toast({
                title: 'New Group Created!',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: "top",
            });

        } catch (error) {
            toast({
                title: 'Error occurred',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "top",
            });
        }
    };

    const handleDelete = (del) => {
        setSelectedUsers(selectedUsers.filter(sel => sel._id !== del._id));
    };

    const handleGroup = (userToAdd) => {
        if (selectedUsers.some(u => u._id === userToAdd._id)) {
            toast({
                title: 'User already added!!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }
        setSelectedUsers([...selectedUsers, userToAdd]);
    };

    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="35px"
                        fontFamily="Work sans"
                        d="flex"
                        justifyContent="center"
                    >Create Group Chat</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        d="flex" flexDir="column" alignItems="center">
                        <FormControl>
                            <Input
                                placeholder="Group Name"
                                mb={3}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <Input
                                placeholder="Add Users"
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        <Box w="100%" display="flex" flexWrap="wrap">
                            {selectedUsers.map(u => (
                                <UserBadgeItem key={u._id} user={u} handleFunction={() => handleDelete(u)} />
                            ))}
                        </Box>

                        {load ? (
                            <div className='justify-center'>Loading ...</div>
                        ) : (
                            searchResult?.slice(0, 4).map(user => (
                                <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
                            ))
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' onClick={handleSubmit}>
                            Create Chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default GroupChatModal;
