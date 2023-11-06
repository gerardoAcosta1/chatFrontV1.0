import React, { useEffect, useRef, useState } from 'react';
import functionsRender from '../../utils/functionsRender';
function ConsoleOutput() {
  const [consoleMessages, setConsoleMessages] = useState([]);
    const consoleMessage = useRef()
    const {functions} = functionsRender()
  useEffect(() => {
    const originalConsoleLog = console.log;
    const originalConsoleWarn = console.warn;
    const originalConsoleError = console.error;

    console.log = function (...args) {
        originalConsoleLog.apply(console, args);
        setConsoleMessages((prevMessages) => [...prevMessages, { message: args, type: 'log' }]);
      };
    console.warn = function (...args) {
      originalConsoleWarn.apply(console, args);
      setConsoleMessages((prevMessages) => [...prevMessages, { message: args, type: 'warn' }]);
    };

    console.error = function (...args) {
      originalConsoleError.apply(console, args);
      setConsoleMessages((prevMessages) => [...prevMessages, { message: args, type: 'error' }]);
    };
   
   
    return () => {
      console.log = originalConsoleLog;
      console.warn = originalConsoleWarn;
      console.error = originalConsoleError;
      
    };
   
  }, []);
 
 function stringifyMessage(message) {
  if (typeof message === 'object') {
    return JSON.stringify(message);
  }
  return message.toString();
}


  useEffect(() => {
    functions.scrollToBottom(consoleMessage)
  }, [consoleMessages]);

  return (
    <div className='console-logs' ref={consoleMessage}>
      {consoleMessages.map((message, index) => (
        <div key={index} className={`console-${message.type}`}>
       <h4 className='point'></h4>
      <pre className="console-message">{stringifyMessage(message.message) }</pre>
      </div>
        
      ))}
    </div>
  );
}
export default ConsoleOutput