import { useRef, useEffect } from 'react';
import './preview.css';

interface PreviewProps {
  code: string;
}

const html = `
  <html>
    <head>
    </head>
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

const Preview: React.FC<PreviewProps> = ({ code }) => {
  const iFrameRef = useRef<any>();

  useEffect(() => {
    iFrameRef.current.srcdoc = html;
    const timer = setTimeout(() => {
      iFrameRef.current.contentWindow.postMessage(code, '*');
    }, 50);
    return () => clearTimeout(timer);
  }, [code]);

  return (
    <div className='preview-wrapper'>
      <iframe
        title='codeIFrame'
        srcDoc={html}
        sandbox='allow-scripts'
        ref={iFrameRef}
      ></iframe>
    </div>
  );
};

export default Preview;
