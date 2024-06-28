import { useDisclosure } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalFooter, Button, ModalOverlay } from "@chakra-ui/react";

const Profile = ({user, children}) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <>
        {children ? <span onClick={onOpen}>{children}</span>:(<FontAwesomeIcon icon={faEye} onClick={onOpen}></FontAwesomeIcon>)}
        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <img style={{borderRadius:"50%"}} src={user.pic} alt={user.name}></img>
            <center><div>{user.email}</div></center>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
        </>
    )
};

export default Profile;