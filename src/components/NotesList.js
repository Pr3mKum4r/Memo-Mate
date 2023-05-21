import Note from "./Note";
import AddNote from "./AddNote";

const NotesList = (props) => {
    const notes = props.noteContent;
  return (
    <div className="notes-list">
      {notes.map((note) => {
        return <Note id={note.id} text={note.text}
        date={note.date}
        handleDeleteNote={props.handleDeleteNote}/>
      })}
      <AddNote handleAddNote={props.handleAddNote}/>
    </div>
  );
};

export default NotesList;
