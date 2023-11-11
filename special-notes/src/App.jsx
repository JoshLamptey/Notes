import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import Split from 'react-split';
import { onSnapshot, addDoc, doc, deleteDoc } from 'firebase/firestore';
import { collectNotes, db } from './firebase';
import { useEffect, useState } from 'react';
import './App.css';

export default function App() {
  const [notes, setNotes] = useState([]);
  const [currentNoteId, setCurrentNoteId] = useState(notes[0]?.id || '');

  // a replacement for the find currentnote helper function
  const currentNote =
    notes.find((note) => {
      note.id === currentNoteId;
    }) || notes[0];

  // Function to add new note(local Storage)

  useEffect(() => {
    const unsubscribe = onSnapshot(collectNotes, (snapshot) => {
      // sync up our local notes arrray with the snapshot data
      const notesArr = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setNotes(notesArr);
    });
  }, []);

  async function createNewNote() {
    const NewNote = {
      body: "# Type Your Markdown  Note's Title Here",
    };
    const newNoteRef = await addDoc(collectNotes, NewNote);
    setCurrentNoteId(newNoteRef.id);
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

  async function deleteNotes(noteId) {
    const docRef = doc(db, 'notes', noteId);
    await deleteDoc(docRef);
  }

  return (
    <main>
      {notes.length > 0 ? (
        <Split sizes={[30, 70]} direction="horizontal" className="split">
          <Sidebar
            notes={notes}
            currentNote={currentNote}
            setCurrentNoteId={setCurrentNoteId}
            newNote={createNewNote}
            deleteNotes={deleteNotes}
          />
          {currentNoteId && notes.length > 0 && <Editor currentNote={currentNote} updateNotes={updateNotes} />}
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
