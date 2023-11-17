import showdown from 'showdown';
import ReactMde from 'react-mde';
import 'react-mde/lib/styles/css/react-mde-all.css';
import { useState } from 'react';

export default function Editor({ tempNoteText, setTempNoteText }) {
  const [selectedTab, setSelectedTab] = useState('write');

  const converter = new showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true,
  });
  return (
    <section className="pane editor">
      <ReactMde
        value={tempNoteText}
        onChange={setTempNoteText}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        generateMarkdownPreview={(markdown) => Promise.resolve(converter.makeHtml(markdown))}
        minEditorHeight={80}
        heightUnits="vh"
      />
    </section>
  );
}
