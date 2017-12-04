import React from 'react';
import ReactDom, { render } from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

let mPoint = document.getElementById('root');
render(<App />, mPoint);
registerServiceWorker();
