import * as esbuild from 'esbuild-wasm';
import ReactDOM from 'react-dom';
import { useState, useEffect, useRef } from 'react';
import { unpkgPathPlugin } from './plugins/unpgk-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';

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
    const result = await esBuildRef.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(inputText)],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
    });

    setCode((code) => (code = result.outputFiles[0].text));
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
      <code>{code}</code>
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));
