import React from 'react';
import ReactDOM from 'react-dom/client';
import { getTypeParameterOwner } from 'typescript';
import { getSocket, ServerProvider } from './api/Server';
import App from './App';
import "./index.css"


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ServerProvider>
      <App />
    </ServerProvider>
  </React.StrictMode>
);

