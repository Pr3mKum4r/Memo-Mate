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
import LoadingModal from "./components/LoadingModal";



function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [errorTitle, setErrorTitle] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [errorButton, setErrorButton] = useState('Ok');
  const [isLoading, setIsLoading] = useState(false);

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

  const addNote = async (text) => {
    if (user) {
      setIsLoading(true);
      const date = new Date();
      let newNote = {
        id: Math.floor(Math.random() * 100000 + 1),
        text: text,
        date: date.toLocaleDateString(),
      };
      // const newNotes = [...noteContent, newNote];
      // // localStorage.setItem('notes', JSON.stringify(newNotes));
      // setNoteContent(newNotes);

      await Axios.post('https://memo-mate-server.onrender.com/save', {
        NoteDataId: newNote.id,
        NoteDataText: newNote.text,
        NoteDataDate: newNote.date,
        UserId: user.email,
      })
        .then(response => {
          newNote = response.data.data;
          const newNotes = [...noteContent, newNote];
          setNoteContent(newNotes);
        });

      setIsLoading(false);
    }
    else {
      onOpen();
      setErrorTitle('User Access Error');
      setErrorMsg('Login first to add your first note!');
      setErrorButton('OK');
    }
  };

  // useEffect(() => {
  //   const localNotes = JSON.parse(localStorage.getItem('notes'));
  //   setNoteContent(localNotes);
  // }, [])



  const deleteNote = async (id) => {
    // localStorage.setItem('notes', JSON.stringify(newNotes));

    setIsLoading(true);

    try {
      const response = await Axios.delete(`https://memo-mate-server.onrender.com/deleteNote/${id}`);
      if (response.status === 200) {
        console.log("Note Deleted Successfully");
      }
    } catch (error) {
      console.error(error);
    }
    const newNotes = noteContent.filter((note) => note.UserData.NoteDataId !== id);
    setNoteContent(newNotes);

    setIsLoading(false);
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


  useEffect(() => {
    // fetch("http://localhost:4000/getUserData", {
    //   method: "GET"
    // })
    //   .then((res)=>res.json())
    //   .then((data)=> {
    //     console.log(data);
    //   })
    const getNotes = async () => {
      setIsLoading(true);
      if (user) {
        await Axios.post('https://memo-mate-server.onrender.com/getUserData', { email: user.email })
          .then(response => response.data)
          .then(data => {
            console.log(data);
            console.log(data.data);
            setNoteContent(data.data);
          })
          .catch(error => {
            // Handle errors
          });
      }
      setIsLoading(false);
    }
    getNotes();
  }, [isAuthenticated, user])

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
      <LoadingModal isLoading={isLoading} msg={'Loading'} />
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
