import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import { data } from './data';
import Split from 'react-split';
import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';
import './App.css';

export default function App() {
  const [notes, setNotes] = useState(() => {
    return JSON.parse(localStorage.getItem('notes')) || [];
  });
  const [currentNoteId, setCurrentNoteId] = useState((notes[0] && notes[0].id) || '');

  // Function to add new note(local Storage)

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  function createNewNote() {
    const NewNote = {
      id: nanoid(),
      body: "# Type Your Markdown  Note's Title Here",
    };
    setNotes((prevNotes) => [NewNote, ...prevNotes]);
    setCurrentNoteId(NewNote.id);
  }
  /// this function will be refactored
  function updateNotes(text) {
    // try to rearrange the updated notes to the top

    setNotes((oldNotes) => {
      const newArray = [];
      for (let i = 0; i < oldNotes.length; i++) {
        const oldNote = oldNotes[i];
        if (oldNote.id === currentNoteId) {
          newArray.unshift({ ...oldNote, body: text });
        } else {
          newArray.push(oldNote);
        }
      }
      return newArray;
    });
  }
  // this doesn't update notes
  // this is a reference
  //setNotes((oldNotes) =>
  //  oldNotes.map((oldNote) => {
  //  return oldNote.id === currentNoteId ? { ...oldNote, body: text } : oldNote;
  //}),
  //);
  //}

  function deleteNotes(event, noteId) {
    event.stopPropagation();
    setNotes((oldnotes) => oldnotes.filter((note) => note.id != noteId));
  }

  function findCurrentNotes() {
    return (
      notes.find((note) => {
        return note.id === currentNoteId;
      }) || notes[0]
    );
  }

  return (
    <main>
      {notes.length > 0 ? (
        <Split sizes={[30, 70]} direction="horizontal" className="split">
          <Sidebar
            notes={notes}
            currentNote={findCurrentNotes()}
            setCurrentNoteId={setCurrentNoteId}
            newNote={createNewNote}
            deleteNotes={deleteNotes}
          />
          {currentNoteId && notes.length > 0 && <Editor currentNote={findCurrentNotes()} updateNotes={updateNotes} />}
        </Split>
      ) : (
        <div className="no-notes">
          <h1>You Have No Notes</h1>
          <button className="first-note" onClick={createNewNote}>
            Create One Now
          </button>
        </div>
      )}
    </main>
  );
}
