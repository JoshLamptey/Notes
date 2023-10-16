
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor"
import { data } from "./data";
import Split from "react-split"
import {nanoid} from "nanoid"
import { useState } from "react";

export default function App(){
  const [notes,setNotes] = useState([])
  const [currentNoteId,setCurrentNoteId]= useState(
    (notes[0] && notes[0].id) || ""
  )

  function createNewNote(){
    const NewNote ={
      id: nanoid(),
      body: "# Type Your Markdown  Note's Title Here"
    }
    setNotes(prevNotes=>[NewNote,...prevNotes])
    setCurrentNoteId(NewNote.id)
  }

  function updateNotes(text){
    setNotes(oldNotes=>oldNotes.map(oldNote=>{
      return oldNote.id === currentNoteId
      ?{...oldNote,body:text}
      : oldNote
    }))
  }

  function findCurrentNotes(){
    return   notes.find((note)=> {
    note.id===currentNoteId
  }) || notes[0]
  }

  return(
    <main>
      {
     notes.length > 0
     ?
      <Split
      sizes={[30,70]}
      direction="horizontal"
      className="split"
      >
     <Sidebar
     notes={notes}
     currentNote={findCurrentNotes()}
     setCurrentNoteId ={setCurrentNoteId}
     newNote={createNewNote}
     />
     {
      currentNoteId && 
      notes.length > 0 &&
      <Editor
      currentNote = {findCurrentNotes}
      updateNotes = {updateNotes}
      />
     }
   </Split>
    :
    <div className="no-notes">
      <h1>You Have No Notes</h1>
      <button 
      className="first-note"
      onClick={createNewNote}
      >
        Create One Now
      </button>
    </div>
  }
    </main>
  )

}