import { Text, Box, Button, Tooltip, Menu, MenuButton, Avatar, MenuList, MenuItem, MenuDivider } from "@chakra-ui/react";
import { useState } from "react";
import { faSearch, faBell, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChatState } from "../../Context/chatProvider";
import { useHistory } from "react-router-dom";

const SideDrawer = () => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState();

    const { user } = ChatState();
    const history = useHistory();

    const logoutHandler = () => {
        localStorage.removeItem("user");
        history.push('/');
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
                    <Button variant="ghost">
                        <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                        <Text
                            display={{base:"none", md:'flex'}}
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
                            <MenuItem>My Profile</MenuItem>
                            <MenuDivider />
                            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>
        </>
    )
};

export default SideDrawer;