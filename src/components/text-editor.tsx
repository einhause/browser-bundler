import { useState, useEffect, useRef } from 'react';
import MDEditor from '@uiw/react-md-editor';
import './text-editor.css';

const TextEditor: React.FC = () => {
  const MDEditorRef = useRef<HTMLDivElement | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [value, setValue] = useState<string>('# Header');

  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (MDEditorRef?.current?.contains(e?.target as Node)) return;
      setIsEditing(false);
    };
    document.addEventListener('click', listener, { capture: true });
    return () => {
      document.removeEventListener('click', listener, { capture: true });
    };
  }, []);

  if (isEditing) {
    return (
      <div className='text-editor' ref={MDEditorRef}>
        <MDEditor value={value} onChange={(v) => setValue(v || '')} />
      </div>
    );
  }

  return (
    <div className='text-editor card' onClick={() => setIsEditing(true)}>
      <div className='card-content'>
        <MDEditor.Markdown source={value} />
      </div>
    </div>
  );
};

export default TextEditor;
