import { Text, Box, Button, Tooltip, Menu, MenuButton, Avatar, MenuList, MenuItem, MenuDivider, Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Toast, Spinner } from "@chakra-ui/react";
import { useState } from "react";
import { faSearch, faBell, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChatState } from "../Context/chatProvider";
import { useHistory } from "react-router-dom";
import { useDisclosure, useToast } from "@chakra-ui/react";
import Profile from "./Profile";
import axios from "axios";
import Loading from "./Loading";
import UserListItem from "./UserListItem";

const SideDrawer = () => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState();

    const { user, setSelectedChat, chats, setChats } = ChatState();
    const history = useHistory();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const logoutHandler = () => {
        localStorage.removeItem("user");
        history.push('/');
    }

    const toast = useToast();

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: "Please enter something in search",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left",
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
                title: "Failed to load search results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);

            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.post("http://localhost:5000/api/chat", { userId }, config);

            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
            setSelectedChat(data);
            setLoadingChat(false);
            onClose();
        } catch (error) {
            toast({
                title: "Error fetching the chat",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    }

    return (
        <>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bg="white"
                w="100%"
                p="5px 10px 5px 10px"
                borderWidth="5px"
            >
                <Tooltip
                    label="Search Users"
                    hasArrow
                    placement="bottom-end"
                >
                    <Button variant="ghost" onClick={onOpen}>
                        <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                        <Text
                            display={{ base: "none", md: 'flex' }}
                        >
                            Search User
                        </Text>
                    </Button>
                </Tooltip>
                <Text>CommUni</Text>
                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <FontAwesomeIcon icon={faBell} fontSize="2x1"></FontAwesomeIcon>
                        </MenuButton>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<FontAwesomeIcon icon={faChevronDown}></FontAwesomeIcon>}>
                            <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic}></Avatar>
                        </MenuButton>
                        <MenuList>
                            <Profile user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </Profile>
                            <MenuDivider />
                            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>
            <Drawer
                placement="left"
                onClose={onClose}
                isOpen={isOpen}
            >
                <DrawerOverlay></DrawerOverlay>
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
                    <DrawerBody>
                        <Box display="flex" pb={2}>
                            <input placeholder="Search by name or email" value={search} onChange={(e) => setSearch(e.target.value)} style={{ border: NaN }}></input>
                            <button className="text-blue-700 rounded-md py-2 my-2 px-2 w-full" onClick={handleSearch}>Go</button>
                        </Box>
                        {loading ? (
                            <Loading />
                        ) : (
                            searchResult?.map(user => (
                                <UserListItem key={user._id} user={user} handleFunction={() => accessChat(user._id)}></UserListItem>
                            ))
                        )}
                        {loadingChat && <Spinner ml="auto" display="flex"></Spinner>}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

        </>
    )
};

export default SideDrawer;