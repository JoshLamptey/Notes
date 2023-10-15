
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

  

}