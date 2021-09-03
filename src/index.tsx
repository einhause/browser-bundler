import * as esbuild from 'esbuild-wasm';
import ReactDOM from 'react-dom';
import { useState, useEffect, useRef } from 'react';
import { unpkgPathPlugin } from './plugins/unpgk-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';

const App = () => {
  const esBuildRef = useRef<any>();
  const iFrameRef = useRef<any>();

  // User input text
  const [inputText, setInputText] = useState<string>('');

  // inits esbuild
  const startService = async () => {
    esBuildRef.current = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
    });
  };

  const onClick = async () => {
    if (!esBuildRef.current) return;

    iFrameRef.current.srcdoc = html;

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

    // setCode((code) => (code = result.outputFiles[0].text));
    iFrameRef.current.contentWindow.postMessage(
      result.outputFiles[0].text,
      '*'
    );
  };

  useEffect(() => {
    startService();
  }, []);

  const html = `
  <html>
    <head></head>
    <body>
      <div id='root'></div>
      <script>
        window.addEventListener(
        'message',
        (e) => {
          try {
            eval(e.data)
          } catch (err) {
            const root = document.querySelector('#root');
            root.innerHTML = \`<div style="color: red;"><h4>Runtime Error</h4>\${err}</div>\`;
            console.error(err);
          }
        },
        false
        );
      </script>
    </body>
  </html>
  `;

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
      <iframe
        title='codeIFrame'
        srcDoc={html}
        sandbox='allow-scripts'
        ref={iFrameRef}
      ></iframe>
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));
