import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import app from './base';
import Firebase from 'firebase';
import Home from './components/Home';
import Login from './components/Login';
import Reset from './components/Reset';
import Signup from './components/Signup';
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
    this.handleSignup = this.handleSignup.bind(this);
    this.goToReg = this.goToReg.bind(this);
    this.goToReset = this.goToReset.bind(this);
    this.state = {
      uid: null
    }
  }
  componentWillUpdate(nextProps, nextState){
    let uid = this.state.uid;
    let name = this.state.dname;
    if(nextState !== null || nextState !== "") {
      localStorage.setItem(uid, name);
    }
  }
  handleSubmit(callback){
    let email = this.state.email;
    let password = this.state.Lpass;
    let exists = this.state.exists;
    if(email !== null && password !== null){ 
        this.eAuthenticate(email, password); 
    }else{
      this.setState({
        LoginMessage: "Enter a proper email and password"
      });
    }     
  }
  handleSignup(callback){
    let email = this.state.email;
    let password = this.state.Lpass;
    let exists = this.state.exists;
    if(email !== null && password !== null){ 
        this.eAuthenticate(email, password); 
    }else{
      this.setState({
        LoginMessage: "Enter a proper email and password"
      });
    }     
  }
  handleEmail(event){
    let emailregex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    let emailAdd = event.target.value;
    this.setState({
        Lemail: emailAdd,
    });
    if(emailAdd.match(emailregex)){
      this.setState({
          email: emailAdd,
          LoginMessage: null
      });
    }else{
      this.setState({
        email: null,
        LoginMessage: "Please enter an email address"
      })
    }
  }
  handlePass(event){
    let pass = event.target.value;
    let passLen = pass.length;
    if(passLen >= 8){
      this.setState({
          Lpass: event.target.value,
          LoginMessage: null
      });
    }else{
      this.setState({
        Lpass: null,
        LoginMessage: "Your password should be 8 or more characters"
      });
    }
  }
  goToReset(){
    this.setState({
      reset: true
    });
  }
  goToReg(){
    this.setState({
      exists: false
    });
  }
  eSignup(email, password){
    app.auth().createUserWithEmailAndPassword(email, password).then(()=>{
      this.setState({
        exists: null
      });
    }, (error)=>{
      this.setState({
        LoginMessage: error.message,
        exists: false
      });
    });
  }
    
  eAuthenticate(email, password){
    let name = email.split('@');
    name = name[0];
    app.auth().signInWithEmailAndPassword(email, password).then(()=>{
      this.setState({
        uid: email,
        dname: name
      });
    }, (error)=>{
      console.log(error.message)
      this.setState({
        LoginMessage: "Please confirm your cridentials, reset your password or signup."
      });
    });
  }
  authenticate(provider, callback){
    app.auth().signInWithPopup(provider).then(callback, (error)=>{
      this.setState({
        LoginMessage: error.message
      });
    });
  }
  
  authHandler(authData){
    const uid= authData.user.uid;
    const name= authData.user.displayName;
    const email= authData.user.email;
    this.setState({
      uid: uid,
      email: email,
      dname: name
    });
  }
  renderLogin(){
    const fbAuth = new Firebase.auth.FacebookAuthProvider();
    const googleAuth = new Firebase.auth.GoogleAuthProvider();
    const Reg = <span className="link" onClick={()=>this.goToReg()}>Register</span>;
    const pReset = <span className="link" onClick={()=>this.goToReset()}>Reset Passowrd</span>;
    return(
      <div>
        <h3>Kilembe School Sign in</h3>
        <div id="feedBack">{this.state.LoginMessage}</div>
        <Login onsubmit={this.handleSubmit} userEmail={this.handleEmail} pass={this.handlePass}/>
        { Reg }  { pReset }
        <button onClick={()=>this.authenticate(fbAuth, this.authHandler)}>Sign in with Facebook</button><br/>
        <button onClick={()=>this.authenticate(googleAuth, this.authHandler)}>Sign in with Google</button><br/>
      </div>
    )
  }
  logout() {
    app.auth().signOut().then(()=>{
      this.setState({
        uid:null,
        Lemail:null,
        email: null,
        dname:null,
        Lpass:null
      });
      console.log("user signed out!");
    })
  }
  render() {
    const logout = <button onClick={this.logout}>Logout</button>;
    if(this.state.uid !== null) {
      return(
        <div>
          <Home logout={logout} dname={this.state.dname} email={this.state.email} />
        </div>
      )
    }else if(this.state.exists === false){
      return(
        <div>
          <Signup  />
        </div>
      )
    }else if(this.state.reset === true) {
      return(
        <div>
          <Reset  />
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
