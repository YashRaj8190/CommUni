import React, { useState } from 'react';
import axios from 'axios';
import { useDisclosure } from "@chakra-ui/react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    IconButton,
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
                    <ModalHeader>Group Settings</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <div className='font-semibold'>Members</div>
                        <div className="flex flex-wrap w-full pb-3 rounded-lg">
                            {selectedChat.users.map(u => (
                                <UserBadgeItem key={u._id} user={u} handleFunction={() => handleRemove(u)} />
                            ))}
                        </div>
                        <div className="flex ">
                            <input
                                type="text"
                                placeholder="Change Name"
                                className="px-3 py-2 my-2 mb-3 border rounded-lg w-4/5"
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <button
                                className="px-2 my-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg ml-2"
                                disabled={renameLoad}
                                onClick={handleRename}
                            >
                                {renameLoad ? 'Updating...' : 'Update'}
                            </button>
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Add new members"
                                className="px-3 py-2 mb-1 border rounded-lg w-4/5"
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>

                        {load ? (
                            <div className='justify-center'>Loading ...</div>
                        ) : (
                            searchResult?.slice(0, 4).map(user => (
                                <UserListItem key={user._id} user={user} handleFunction={() => handleAdd(user)} />
                            ))
                        )}

                    </ModalBody>

                    <ModalFooter>
                        <button
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg mr-1"
                            onClick={() => handleRemove(user)}
                        >
                            Leave Group
                        </button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateGroup;
