import React, { useState } from 'react';
import axios from 'axios';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useToast } from '@chakra-ui/react';
import { ChatState } from '../Context/chatProvider';

const UpdateProfile = ({ isOpen, onClose, fetchAgain, setFetchAgain }) => {
    const [username, setUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);

    const toast = useToast();
    const { user, setUser } = ChatState();

    const handleRename = async () => {
        if (!username) return;
        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put('http://localhost:5000/api/user/rename', {
                userId: user._id,
                newUsername: username,
            }, config);
            setUser(data);
            setRenameLoading(false);
            toast({
                title: 'Username updated successfully!',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: "top",
            });

            setFetchAgain(!fetchAgain);
        } catch (error) {
            toast({
                title: 'Error occurred!',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            setRenameLoading(false);
        }
    };

    const handlePasswordUpdate = async () => {
        if (!newPassword) return;
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put('http://localhost:5000/api/user/updatePassword', {
                userId: user._id,
                newPassword: newPassword,
            }, config);
            setLoading(false);
            toast({
                title: 'Password updated successfully!',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            setFetchAgain(!fetchAgain);
        } catch (error) {
            toast({
                title: 'Error occurred!',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Update Profile</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <div className="flex">
                        <input
                            placeholder="Enter new name"
                            className='border p-2 rounded-md my-2 w-full'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <button
                            className='bg-green-500 hover:bg-green-600 p-2 rounded-lg text-white my-2 ml-2'
                            onClick={handleRename}
                            isLoading={renameLoading}
                            mb={3}
                        >
                            Update
                        </button>
                    </div>
                    <div className="flex flex-col">
                        <input
                            type="password"
                            placeholder="Enter new Password"
                            className='border p-2 rounded-md my-2'
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <button
                            className='bg-blue-600 hover:bg-blue-700 p-2 rounded-lg text-white'
                            onClick={handlePasswordUpdate}
                            isLoading={loading}
                        >
                            Update Password
                        </button>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <button onClick={onClose} className='bg-red-500 hover:bg-red-600 p-2 rounded-lg text-white'>
                        Close
                    </button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default UpdateProfile;
