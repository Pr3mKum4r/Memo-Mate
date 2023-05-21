import { IconButton } from "@chakra-ui/react";
import { DeleteIcon } from '@chakra-ui/icons';
import './Note.css';

const Note = (props) => {
  return (
    <div className="note">
      <textarea className="noteArea" value={props.text} disabled={true}></textarea>
      <div className="note-footer">
        <small className="charLimit">{props.date}</small>
        <IconButton bgColor='#d92525' color='#FFF' borderRadius='40px' boxShadow='2px 2px 3px #999' h='40px' w='40px' _hover={{ bg: "red.900" }} ml={130} icon={<DeleteIcon/>} onClick={() => props.handleDeleteNote(props.id)}/>
      </div>
    </div>
  );
};

export default Note;
