import Note from "./Note";
import AddNote from "./AddNote";

const NotesList = (props) => {
    const notes = props.noteContent;
  return (
    <div className="notes-list">
      {notes.map((note) => {
        return <Note id={note.UserData.NoteDataId} text={note.UserData.NoteDataText}
        date={note.UserData.NoteDataDate}
        handleDeleteNote={props.handleDeleteNote}/>
      })}
      <AddNote handleAddNote={props.handleAddNote}/>
    </div>
  );
};

export default NotesList;
