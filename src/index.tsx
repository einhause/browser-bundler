import * as esbuild from 'esbuild-wasm';
import ReactDOM from 'react-dom';
import { useState, useEffect, useRef } from 'react';

const App = () => {
  const esBuildRef = useRef<any>();
  // User input text
  const [inputText, setInputText] = useState<string>('');
  // Output from ESBuild
  const [code, setCode] = useState<string>('');

  // inits esbuild
  const startService = async () => {
    esBuildRef.current = await esbuild.startService({
      worker: true,
      wasmURL: '/esbuild.wasm',
    });
  };

  const onClick = async () => {
    if (!esBuildRef.current) return;
    const result = await esBuildRef.current.transform(inputText, {
      loader: 'jsx',
      target: 'es2015',
    });
    setCode((code) => (code = result.code));
  };

  useEffect(() => {
    startService();
  }, []);

  return (
    <div>
      <textarea
        rows={10}
        cols={20}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      ></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <pre>{code}</pre>
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));
