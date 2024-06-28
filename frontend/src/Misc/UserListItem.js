import React from 'react';
import { Avatar, Text } from "@chakra-ui/react";

const UserListItem = ({ user, handleFunction }) => {
    return (
        <div
            onClick={handleFunction}
            style={{ cursor: "pointer", width: "100%", display: "flex", alignItems: "center", color: "black" }}
        >
            <Avatar
                mr={2}
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
            ></Avatar>
            <div>
                <Text>{user.name}</Text>
                <Text fontSize="xs">
                    <b>Email: </b>
                    {user.email}
                </Text>
            </div>
        </div>
    );
};

export default UserListItem;
