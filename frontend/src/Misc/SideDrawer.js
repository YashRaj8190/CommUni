import React, { useState } from 'react';
import {
    Box, Button, Tooltip, Menu, MenuButton, MenuList, MenuItem,
    Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody,
    Spinner, Text, useToast,
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBell, faCog, faUser, faCogs, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router-dom';
import { useDisclosure } from '@chakra-ui/react';
import axios from 'axios';
import Profile from './Profile';
import Loading from './Loading';
import UserListItem from './UserListItem';
import { getSender } from './config/chatLogic';
import { ChatState } from '../Context/chatProvider';
import UpdateProfile from './UpdateProfile';

const SideDrawer = () => {
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const [fetchAgain, setFetchAgain] = useState(false);

    const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
    const history = useHistory();
    const {
        isOpen: isDrawerOpen,
        onOpen: onDrawerOpen,
        onClose: onDrawerClose,
    } = useDisclosure();
    const {
        isOpen: isModalOpen,
        onOpen: onModalOpen,
        onClose: onModalClose,
    } = useDisclosure();
    const toast = useToast();

    const logoutHandler = () => {
        localStorage.removeItem('user');
        history.push('/');
    };

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: 'Please enter something in search',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top-left',
            });
            return;
        }

        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(`http://localhost:5000/api/user?search=${search}`, config);

            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: 'Failed to load search results',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left',
            });
        }
    };

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);

            const config = {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.post('http://localhost:5000/api/chat', { userId }, config);

            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
            setSelectedChat(data);
            setLoadingChat(false);
            onDrawerClose();
        } catch (error) {
            toast({
                title: 'Error fetching the chat',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left',
            });
        }
    };

    return (
        <>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bg="#1f2d3d"
                w="100%"
                color="white"
                p="10px 10px 5px 10px"
                borderWidth="0px"
            >
                <Tooltip label="Search Users" hasArrow placement="bottom-end">
                    <Button variant="ghost" onClick={onDrawerOpen} bg="white">
                        <Text display={{ base: 'none', md: 'flex' }} ml={3}>Search User</Text>
                        <Box as="span" ml={3} mr={3}>
                            <FontAwesomeIcon icon={faSearch} />
                        </Box>
                    </Button>
                </Tooltip>
                <Text fontSize="2xl" fontWeight="semibold">CommUni</Text>
                <div>
                    <Menu>
                        <MenuButton p={1} position="relative" mx={5}>
                            <FontAwesomeIcon icon={faBell} fontSize="2x" />
                            {notification.length !== 0 && (
                                <Box
                                    position="absolute"
                                    top="-2px"
                                    right="-2px"
                                    bg="red.500"
                                    color="white"
                                    fontSize="xs"
                                    fontWeight="bold"
                                    borderRadius="full"
                                    w="16px"
                                    h="16px"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    {notification.length}
                                </Box>
                            )}
                        </MenuButton>
                        <MenuList bg="#1f2d3d">
                            {!notification.length && <MenuItem bg="#1f2d3d" color="white">No new messages</MenuItem>}
                            {[...new Map(notification.map(item => [item.chat._id, item])).values()].map(notif => {
                                const messageCount = notification.filter(n => n.chat._id === notif.chat._id).length;
                                return (
                                    <MenuItem
                                        key={notif.chat._id}
                                        bg="#1f2d3d"
                                        _hover={{ bg: "#4a5568" }}
                                        color="white"
                                        onClick={() => {
                                            setSelectedChat(notif.chat);
                                            setNotification(notification.filter(n => n.chat._id !== notif.chat._id));
                                        }}
                                    >
                                        {`${messageCount} new message${messageCount !== 1 ? 's' : ''} from ${notif.chat.isGroupChat ? notif.chat.chatName : getSender(user, notif.chat.users)}`}
                                    </MenuItem>
                                );
                            })}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton mx={5}>
                            <FontAwesomeIcon icon={faCog} />
                        </MenuButton>
                        <MenuList bg="#1f2d3d">
                            <Profile user={user}>
                                <MenuItem bg="#1f2d3d" color="white" _hover={{ bg: "#4a5568" }}>
                                    <FontAwesomeIcon icon={faUser} className='mr-5' />My Profile
                                </MenuItem>
                            </Profile>
                            <MenuItem onClick={onModalOpen} bg="#1f2d3d" color="white" _hover={{ bg: "#4a5568" }}>
                                <FontAwesomeIcon icon={faCogs} className='mr-4' />Update Profile
                            </MenuItem>
                            <MenuItem onClick={logoutHandler} bg="#1f2d3d" color="white" _hover={{ bg: "#4a5568" }}>
                                <FontAwesomeIcon icon={faSignOutAlt} className='mr-5' />
                                Logout
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>
            <Drawer placement="left" onClose={onDrawerClose} isOpen={isDrawerOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px" bg="#4a5568" color="white">Search Users</DrawerHeader>
                    <DrawerBody>
                        <Box display="flex" pb={2}>
                            <input
                                placeholder="Search by name or email"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className='pl-3 rounded-md w-full bg-gray-200 my-2'
                            />
                            <button
                                className="bg-blue-600 text-white ml-2 rounded-md py-2 my-2 px-3"
                                onClick={handleSearch}
                            >
                                Go
                            </button>
                        </Box>
                        {loading ? (
                            <Loading />
                        ) : (
                            searchResult?.map(user => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => accessChat(user._id)}
                                />
                            ))
                        )}
                        {loadingChat && <Spinner ml="auto" display="flex" />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
            <UpdateProfile isOpen={isModalOpen} onClose={onModalClose} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </>
    );
};

export default SideDrawer;
