import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const UserBadgeItem = ({ user, handleFunction }) => {
    return (
        <div className="px-3 py-2 my-1.5 mx-1 rounded-lg cursor-pointer text-sm bg-green-400 hover:bg-green-600 text-white flex items-center "
            onClick={handleFunction}
        >
            <span className="mr-2 font-semibold">{user.name}</span>
            <FontAwesomeIcon icon={faTimes} className="text-black" />
        </div>
    );
};

export default UserBadgeItem;
