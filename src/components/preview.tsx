import { useRef, useEffect } from 'react';
import './preview.css';

interface PreviewProps {
  code: string;
  bundleErr: string;
}

const html = `
  <html>
    <head>
    </head>
    <body>
      <div id='root'></div>
      <script>
        const handleError = (err) => {
          const root = document.querySelector('#root');
          root.innerHTML = \`<div style="color: red;"><h4>Runtime Error</h4>\${err}</div>\`;
          console.error(err);
        };

        // for async errors
        window.addEventListener('error', (e) => {
          e.preventDefault();
          handleError(e.error);
        })

        // for sync errors
        window.addEventListener(
        'message',
        (e) => {
          try {
            eval(e.data);
          } catch (err) {
            handleError(err);
          } 
        },
        false
        );
      </script>
    </body>
  </html>
  `;

const Preview: React.FC<PreviewProps> = ({ code, bundleErr }) => {
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
      />
      {bundleErr && (
        <div className='preview-error'>
          <p>{bundleErr}</p>
        </div>
      )}
    </div>
  );
};

export default Preview;
