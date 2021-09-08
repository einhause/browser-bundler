import { useState, useEffect, useRef } from 'react';
import MDEditor from '@uiw/react-md-editor';
import './text-editor.css';
import { Cell } from '../state';
import { useActions } from '../hooks/use-actions';

interface TextEditorProps {
  cell: Cell;
}

const TextEditor: React.FC<TextEditorProps> = ({ cell }) => {
  const MDEditorRef = useRef<HTMLDivElement | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const { updateCell } = useActions();

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
        <MDEditor
          value={cell.content}
          onChange={(v) => updateCell(cell.id, v ?? '')}
        />
      </div>
    );
  }

  return (
    <div className='text-editor card' onClick={() => setIsEditing(true)}>
      <div className='card-content'>
        <MDEditor.Markdown source={cell.content || 'Click to edit.'} />
      </div>
    </div>
  );
};

export default TextEditor;
