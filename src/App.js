import "./App.css";
import { ChakraProvider, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Button } from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import NotesList from "./components/NotesList";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Profile from "./components/Profile";
import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import Axios from 'axios';



function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [errorTitle, setErrorTitle] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [errorButton, setErrorButton] = useState('Ok');

  const theme = extendTheme({
    styles: {
      global: (props) => ({
        body: {
          bg: mode('teal.5', 'teal')(props),
        }
      })
    },
  })

  const { loginWithRedirect, logout, user, isAuthenticated } =
    useAuth0();

  const [noteContent, setNoteContent] = useState([]);

  const [isProfile, setIsProfile] = useState(false);

  const addNote = (text) => {
    const date = new Date();
    const newNote = {
      id: Math.random() * 100 + 1,
      text: text,
      date: date.toLocaleDateString(),
    };
    const newNotes = [...noteContent, newNote];
    localStorage.setItem('notes', JSON.stringify(newNotes));
    setNoteContent(newNotes);
    Axios.post('http://localhost:4000/save', {
      NoteDataId: newNote.id,
      NoteDataText: newNote.text,
      NoteDataDate: newNote.date,
      UserId: user.email,
    })
  };

  useEffect(() => {
    const localNotes = JSON.parse(localStorage.getItem('notes'));
    setNoteContent(localNotes);
  }, [])



  const deleteNote = (id) => {
    const newNotes = noteContent.filter((note) => note.id !== id);
    localStorage.setItem('notes', JSON.stringify(newNotes));
    setNoteContent(newNotes);
  };

  const profileHandler = () => {
    if (isAuthenticated) {
      setIsProfile(true);
      console.log(user);
    }
    else {
      setIsProfile(false);
      onOpen();
      setErrorTitle('User Profile Error');
      setErrorMsg('No user found. Kindly login first to access Profile!');
      setErrorButton('Ok');
    }
  }

  const modalCloseHandler = () => {
    if (errorButton === 'Logout') {
      logout();
    }
    else {
      onClose();
    }
  }

  const logoutHandler = () => {
    if (isAuthenticated) {
      onOpen();
      setErrorTitle('Logout');
      setErrorMsg('Do you want to Logout?');
      setErrorButton('Logout');
    }
    else {
      onOpen();
      setErrorTitle('User Profile Error');
      setErrorMsg('No user found. Already Logged out!');
    }

  }


  useEffect(()=>{
    fetch("http://localhost:4000/getUserData", {
      method: "GET"
    })
      .then((res)=>res.json())
      .then((data)=> {
        console.log(data);
      })
  }, [isAuthenticated, noteContent])

  let avatar =
    "https://w7.pngwing.com/pngs/205/731/png-transparent-default-avatar-thumbnail.png";
  let name = '';
  let email = '';
  let nickname = '';
  if (isAuthenticated) {
    avatar = user.picture;
    name = user.name;
    email = user.email;
    nickname = user.nickname;
  }
  if (!isAuthenticated) {
    avatar =
      "https://w7.pngwing.com/pngs/205/731/png-transparent-default-avatar-thumbnail.png";
    name = '';
    email = '';
    nickname = '';
  }

  return (
    <>
      <Navbar onLogin={loginWithRedirect} onLogout={logoutHandler} avatar={avatar} onProfile={profileHandler} />
      {isProfile ? (
        <ChakraProvider theme={theme}>
          <Profile avatar={avatar} name={name} email={email} nickname={nickname}></Profile>
        </ChakraProvider>
      ) : (
        <ChakraProvider theme={theme}>
          <div className="container">
            <NotesList
              noteContent={noteContent}
              handleAddNote={addNote}
              handleDeleteNote={deleteNote}
            />
          </div>
        </ChakraProvider>
      )}
      <ChakraProvider theme={theme}>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{errorTitle}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {errorMsg}
            </ModalBody>

            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={modalCloseHandler}>
                {errorButton}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </ChakraProvider>
    </>
  );
}

export default App;
