import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import app from './base';
import Firebase from 'firebase';
import Home from './components/Home';
import Login from './components/Login';
import Reset from './components/Reset';
import Signup from './components/Signup';

class App extends Component {
  
  constructor(props){
    super(props);
    this.authenticate = this.authenticate.bind(this);
    this.renderLogin = this.renderLogin.bind(this);
    this.authHandler = this.authHandler.bind(this);
    this.logout = this.logout.bind(this);
    this.eAuthenticate = this.eAuthenticate.bind(this);
    this.eReset = this.eReset.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
    this.handlePass = this.handlePass.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
    this.goToReg = this.goToReg.bind(this);
    this.goToReset = this.goToReset.bind(this);
    this.goToLogin = this.goToLogin.bind(this);
    this.state = {
      uid: null
    }
  }

  componentWillMount(){
    let uid = localStorage.getItem("uid")==="null"?null:localStorage.getItem("uid");
    let dname = localStorage.getItem("dname")==="null"?null:localStorage.getItem("dname");
    let email = localStorage.getItem("email")==="null"?null:localStorage.getItem("email");
    let exists = localStorage.getItem("exists")==="null" || "undefined"?null:localStorage.getItem("exists");
    if(uid !==null || uid !== "") {
      this.setState({
        uid: uid,
        dname: dname,
        email: email,
        exists: exists
      });
    } 
  }
  handleLogin(event){
    event.preventDefault();
    let email = this.state.email;
    let password = this.state.Lpass;
    if(email !== null && password !== null){ 
        this.eAuthenticate(email, password); 
    }else{
      this.setState({
        LoginMessage: "Enter a proper email and password"
      });
    }     
  }
  handleReset(){
    let email = this.state.email;
    if(email !== null && email !== ""){ 
        this.eReset(email); 
    }else{
      this.setState({
        LoginMessage: "Enter a proper email and password"
      });
    }     
  }
  handleSignup(){
    let email = this.state.email;
    let password = this.state.Lpass;
    if(email !== null && password !== null){ 
        this.eSignup(email, password); 
    }else{
      this.setState({
        LoginMessage: "Enter a proper email and password"
      });
    }     
  }
  handleEmail(event){
    let emailregex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
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
  goToLogin(){
    this.setState({
      exists: null
    });
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
        exists: null,
        LoginMessage: "You Successfully Registered"
      });
    }, (error)=>{
      this.setState({
        LoginMessage: error.message,
        exists: false
      });
    });
  }
  eReset(email){
    app.auth().sendPasswordResetEmail(email).then(()=>{
      this.setState({
        LoginMessage: "We sent you a reset email, please check your inbox"
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
        dname: name,
      });
      let uid = this.state.uid;
      let exists = this.state.exists || null;
      let dname = this.state.dname;
      let Lemail = this.state.Lemail;
      let states = [uid, exists,email,dname,Lemail];
      let statesS = ['uid', 'exists','email','dname','Lemail'];
      let len = states.length;
      for(var count=0;count<len; count++){
        localStorage.setItem(statesS[count], states[count]);
      }
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
        <Login onsubmit={this.handleLogin} userEmail={this.handleEmail} pass={this.handlePass}/>
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
      let uid = this.state.uid;
      let exists = this.state.exists || null;
      let dname = this.state.dname;
      let Lemail = this.state.Lemail;
      let email = this.state.email;
      let states = [uid, exists,email,dname,Lemail];
      let statesS = ['uid', 'exists','email','dname','Lemail'];
      let len = states.length;
      for(var count=0;count<len; count++){
        localStorage.setItem(statesS[count], states[count]);
      }
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
          <Signup message={this.state.LoginMessage} onsignup={this.handleSignup} userEmail={this.handleEmail} pass={this.handlePass} onLogin={this.goToLogin}  />
        </div>
      )
    }else if(this.state.reset === true) {
      return(
        <div>
          <Reset onReset={this.handleReset} message={this.state.LoginMessage}  userEmail={this.handleEmail}/>
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
