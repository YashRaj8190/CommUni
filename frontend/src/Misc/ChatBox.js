import { Box } from "@chakra-ui/react";
import { ChatState } from "../Context/chatProvider";
import SingleChat from "./SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
    const { selectedChat } = ChatState();
    return (

        <Box d={{ base: selectedChat ? "flex" : "none", md: "flex" }}
            alignItems="center"
            flexDir="column" p={3} bg="#1f2d3d"
            w={{ base: "100%", md: "68%" }}
            borderRadius="lg"
            borderWidth="1px">
            <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </Box>

    )
};

export default ChatBox;