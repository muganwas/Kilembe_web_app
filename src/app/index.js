import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import store from './store';
import { Provider } from 'react-redux';
import './styles/index.css';
import './styles/styles.css';
import './styles/animations.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import NotFound from './components/NotFound';

let mPoint = document.getElementById('root');

let mainComponent = ()=>{
	return(
		<Provider store={store}>
			<App/>
		</Provider>
	)
}
var Root = ()=>{
    return(
        <BrowserRouter basename = "/" >
            <div className="main">
                <Switch>
                    <Route exact path="/" component={ mainComponent } />
                    <Route component={ NotFound } />
                </Switch>
            </div>
        </BrowserRouter>
    )
}

render(
    <Root/>, mPoint
    );

registerServiceWorker();