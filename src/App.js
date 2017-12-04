import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import app from './base';
import Firebase from 'firebase';
import Home from './components/Home';
import Login from './components/Login';
import Rebase from 're-base';

class App extends Component {
  
  constructor(props){
    super(props);
    this.authenticate = this.authenticate.bind(this);
    this.renderLogin = this.renderLogin.bind(this);
    this.authHandler = this.authHandler.bind(this);
    this.logout = this.logout.bind(this);
    this.eAuthenticate = this.eAuthenticate.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
    this.handlePass = this.handlePass.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      uid: null,
      email: null,
      dname: null,
      Lemail: null,
      Lpass: null
    }

  }
  componentWillUpdate(nextProps, nextState){
    let uid = this.state.uid;
    let name = this.state.dname;
    if(nextState != null || nextState != "") {
      localStorage.setItem(uid, name);
    }
  }
  handleSubmit(){
    let email = this.state.Lemail;
    let password = this.state.Lpass;
      console.log("user logged in " + email + " " + password);  
  }
  handleEmail(event){
      this.setState({
          Lemail: event.target.value,
      })
  }
  handlePass(event){
    this.setState({
        Lpass: event.target.value,
    })
}
  eAuthenticate(email, password, callback){
  }
  authenticate(provider, callback){
    app.auth().signInWithPopup(provider).then(callback);
  }
  
  authHandler(authData){
    try{
      const uid= authData.user.uid;
      const name= authData.user.displayName;
      const email= authData.user.email;
      this.setState({
        uid: uid,
        email: email,
        dname: name
      });
    }catch(e){
      console.error(e);
    }
  }
  renderLogin(){
    const fbAuth = new Firebase.auth.FacebookAuthProvider();
    const googleAuth = new Firebase.auth.GoogleAuthProvider();
    return(
      <div>
        <h3>Kilembe School Sign in</h3>
        <div id="feedBack"></div>
        <Login onsubmit={this.handleSubmit} userEmail={this.handleEmail} pass={this.handlePass}/>
        <button onClick={()=>this.authenticate(fbAuth, this.authHandler)}>Sign in with Facebook</button><br/>
        <button onClick={()=>this.authenticate(googleAuth, this.authHandler)}>Sign in with Google</button><br/>
      </div>
    )
  }
  logout() {
    app.auth().signOut().then(()=>{
      this.setState({
        uid:null
      });
      console.log("user signed out!");
    })
  }
  render() {
    const logout = <button onClick={this.logout}>Logout</button>;
    if(this.state.uid!= null) {
      return(
        <div>
          <Home logout={logout} dname={this.state.dname} email={this.state.email} />
        </div>
      )
    }else{
      return (
        <div className="App">
          {this.renderLogin()}
        </div>
      )
    }   
  }
}

export default App;
