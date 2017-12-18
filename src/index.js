import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch} from 'react-router-dom'
import './index.css';
import '../src/styles.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import NotFound from './components/NotFound';

let mPoint = document.getElementById('root');
var Root = ()=>{
    return(
        <BrowserRouter basename = "/reactDemo1/" >
        <div className="main">
            <Switch>
                <Route exact path="/" component={ App } />
                <Route component={ NotFound } />
            </Switch>
        </div>
        </BrowserRouter>
    )
}

render(
    <Root/>, 
        mPoint
    );

registerServiceWorker();
