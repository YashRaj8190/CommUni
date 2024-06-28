import { Box, CloseButton } from '@chakra-ui/react';
import React from 'react';

const UserBadgeItem = ({ user, handleFunction }) => {
    return (
        <Box
            px={3} py={1} m={1} mb={2}
            borderRadius="lg" variant="solid"
            cursor="pointer" fontSize={12}
            backgroundColor='purple'
            onClick={handleFunction}
        >
            {user.name}
            <CloseButton pl={1} />
        </Box>
    );
};

export default UserBadgeItem;
