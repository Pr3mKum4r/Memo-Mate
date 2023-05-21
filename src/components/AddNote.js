import { IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Button } from "@chakra-ui/react";
import { AddIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import './Note.css';

const AddNote = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const characterLimit = 100;
  const [noteText, setNoteText] = useState('');
  const [errorTitle, setErrorTitle] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const handleChange = (event) =>{
    if(characterLimit - event.target.value.trim().length >= 0){
        setNoteText(event.target.value);
    } 
    if(characterLimit - event.target.value.trim().length < 0){
        onOpen();
        setErrorTitle('Character Exceeded Error!');
        setErrorMsg('More than 100 characters not allowed. Please enter text within the limit!');
    }
  }
  const handleSaveClick = () =>{
    if(noteText.trim().length > 0 && noteText.trim().length <= characterLimit){
        props.handleAddNote(noteText);
        setNoteText('');
    }
    if(noteText.trim().length === 0){
        onOpen();
        setErrorTitle('Empty Note Error!');
        setErrorMsg('Empty note not allowed. Please enter some text before adding a new note!')
    }
  }

  return (
    <>
    <div className="note">
      <textarea className="noteArea" rows="5" cols="50" value={noteText} onChange={handleChange} placeholder="Type your new note . ."></textarea>
      <div className="note-footer">
        <small className="charLimit">{characterLimit - noteText.length} Chars Remaining</small>
        <IconButton bgColor='#0C9' color='#FFF' borderRadius='40px' boxShadow='2px 2px 3px #999' h='40px' w='40px' _hover={{ bg: "teal.600" }} ml={130} icon={<AddIcon/>} onClick={handleSaveClick}/>
      </div>
    </div>
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{errorTitle}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {errorMsg}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Ok
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddNote;
