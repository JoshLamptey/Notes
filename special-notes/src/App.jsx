import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import Split from 'react-split';
import { onSnapshot, addDoc, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { collectNotes, db } from './firebase';
import { useEffect, useState } from 'react';
import './App.css';

export default function App() {
  const [notes, setNotes] = useState([]);
  const [currentNoteId, setCurrentNoteId] = useState('');
  const [tempNoteText, setTempNoteText] = useState('');
  const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt);

  const currentNote = notes.find((note) => note.id === currentNoteId) || notes[0];

  // Function to add new note(firestore database)

  useEffect(() => {
    const unsubscribe = onSnapshot(collectNotes, (snapshot) => {
      // sync up our local notes arrray with the snapshot data
      const notesArr = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setNotes(notesArr);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      if (tempNoteText !== currentNote.body) {
        updateNotes(tempNoteText);
      }
    }, 3000);
    return () => clearTimeout(timeOutId);
  }, [tempNoteText]);

  useEffect(() => {
    if (currentNote) {
      setTempNoteText(currentNote.body);
    }
  }, [currentNote]);
  useEffect(() => {
    if (!currentNoteId) {
      setCurrentNoteId(notes[0]?.id);
    }
  }, [notes]);
  console.log(currentNoteId);

  async function createNewNote() {
    const NewNote = {
      body: "# Type Your Markdown  Note's Title Here",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const newNoteRef = await addDoc(collectNotes, NewNote);
    console.log(newNoteRef.id);
    setCurrentNoteId(newNoteRef.id);
  }
  /// this function will be refactored
  async function updateNotes(text) {
    const docRef = doc(db, 'notes', currentNoteId);
    await setDoc(docRef, { body: text, updatedAt: Date.now() }, { merge: true });
  }

  async function deleteNotes(noteId) {
    const docRef = doc(db, 'notes', noteId);
    await deleteDoc(docRef);
  }

  return (
    <main>
      {notes.length > 0 ? (
        <Split sizes={[30, 70]} direction="horizontal" className="split">
          <Sidebar
            notes={sortedNotes}
            currentNote={currentNote}
            setCurrentNoteId={setCurrentNoteId}
            newNote={createNewNote}
            deleteNotes={deleteNotes}
          />
          <Editor tempNoteText={tempNoteText} setTempNoteText={setTempNoteText} />
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
