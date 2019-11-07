import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import store from './store';
import { Provider } from 'react-intl-redux';
import './styles/index.css';
import './styles/styles.css';
import './styles/animations.css';
import App from './App';
import { 
    Signup,
    Settings,
    Reset,
    NotFound,
    Messaging,
    Login,
    Home,
    Friends
} from 'components';
import registerServiceWorker from './registerServiceWorker';

let mPoint = document.getElementById('root');

let MainComponent = ()=>{
	return(
		<Provider store={store}>
			<App/>
		</Provider>
	)
}
let FriendsComponent = ()=>{
	return(
		<Provider store={store}>
			<Friends/>
		</Provider>
	)
}
let HomeComponent = ()=>{
	return(
		<Provider store={store}>
			<Home/>
		</Provider>
	)
}
let LoginComponent = ()=>{
	return(
		<Provider store={store}>
			<Login/>
		</Provider>
	)
}
let SignupComponent = ()=>{
	return(
		<Provider store={store}>
			<Signup/>
		</Provider>
	)
}
let ResetComponent = ()=>{
	return(
		<Provider store={store}>
			<Reset/>
		</Provider>
	)
}
let SettingsComponent = ()=>{
	return(
		<Provider store={store}>
			<Settings/>
		</Provider>
	)
}
let MessagingComponent = ()=>{
	return(
		<Provider store={store}>
			<Messaging/>
		</Provider>
	)
}

let NotFoundComponent = ()=>{
	return(
		<Provider store={store}>
			<NotFound/>
		</Provider>
	)
}
var Root = ()=>{
    return(
        <BrowserRouter basename = "/" >
			<Switch>
				<Route exact path="/" component={ MainComponent } />
				<Route exact path="/login" component={ LoginComponent } />
				<Route exact path="/signup" component={ SignupComponent } />
				<Route exact path="/reset" component={ ResetComponent } />
				<Route exact path="/home" component={ HomeComponent } />
				<Route exact path="/messaging" component={ MessagingComponent } />
				<Route exact path="/settings" component={ SettingsComponent } />
				<Route exact path="/friends" component={ FriendsComponent } />
				<Route component={ NotFoundComponent } />
			</Switch>
        </BrowserRouter>
    )
}

render(
    <Root/>, mPoint
    );

registerServiceWorker();