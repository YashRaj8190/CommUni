import { useDisclosure } from "@chakra-ui/react";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Avatar } from "@chakra-ui/react";

const Profile = ({ user, children }) => {

  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (<span onClick={onOpen}>{children}</span>) : (
        <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic} onClick={onOpen} />
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader >{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <img style={{ borderRadius: "20%" }} src={user.pic} alt={user.name}></img>
            <center><div>{user.email}</div></center>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
};

export default Profile;