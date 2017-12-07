import React from 'react';
import { render } from 'react-dom';
import './index.css';
import '../src/styles.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import Header from './components/Header';

let mPoint = document.getElementById('root');
render(<div className="main"><Header /> <App /></div>, mPoint);
registerServiceWorker();
