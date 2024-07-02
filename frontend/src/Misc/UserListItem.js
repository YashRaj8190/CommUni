import React from 'react';
import { Avatar } from "@chakra-ui/react";

const UserListItem = ({ user, handleFunction }) => {
    return (
        <div onClick={handleFunction}
            className="cursor-pointer w-full flex items-center text-black" >
            <Avatar
                mx={2}
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
            />
            <div>
                <div className="text-base ">{user.name}</div>
                <div className="text-xs">
                    <b>Email: </b>{user.email}
                </div>
            </div>
        </div>
    );
};

export default UserListItem;
