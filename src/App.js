import React, { Component } from 'react';
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
    this.handlePassConf = this.handlePassConf.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
    this.goToReg = this.goToReg.bind(this);
    this.goToReset = this.goToReset.bind(this);
    this.goToLogin = this.goToLogin.bind(this);
    this.state = {
      uid: null,
      hidden: true
    }
  }
  componentWillMount(){
    let uid = localStorage.getItem("uid")==="null"?null:localStorage.getItem("uid");
    let dname = localStorage.getItem("dname")==="null"?null:localStorage.getItem("dname");
    let email = localStorage.getItem("email")==="null"?null:localStorage.getItem("email");
    let exists = localStorage.getItem("exists")==="null"?null:localStorage.getItem("exists")==="false"?false:localStorage.getItem("exists");
    let reset = localStorage.getItem("reset")=="null"?null:localStorage.getItem("reset")=="true"?true:localStorage.getItem("reset");
    if(uid != null && exists ==null) {
      this.setState({
        uid: uid,
        dname: dname,
        email: email,
        exists: exists
      });
    }else if(uid == null && exists !==null){
      this.setState({
        exists: exists
      });
    }else if(uid == null && reset === true){
      this.setState({
        reset: reset
      });
    }
  }
 
  handleLogin(event){
    event.preventDefault();
    let email = this.state.email;
    let password = this.state.Lpass;
    if((email != null && email !== "") && (password != null && password !== "")){ 
        this.eAuthenticate(email, password); 
    }else{
      this.setState({
        LoginMessage: "Enter a proper email and password"
      }, ()=>{
        if(this.state.LoginMessage !== null && this.state.LoginMessage !== undefined && this.state.LoginMessage !== "") {
          this.setState({
            hidden: false
          });
        }
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
      }, ()=>{
        if(this.state.LoginMessage !== null && this.state.LoginMessage !== undefined && this.state.LoginMessage !== "") {
          this.setState({
            hidden: false
          });
        }
      });
    }     
  }
  handleSignup(){
    let email = this.state.email;
    let password = this.state.Lpass;
    if((email != null && email !== "") && (password != null && password !== "")){
      if((this.state.LoginMessage === null || this.state.LoginMessage === undefined) && (this.state.Lpass === this.state.PassCon)) {
        this.eSignup(email, password);
      }else{
        let messg = "Rectify error bellow <br/>" + this.state.LoginMessage;
        this.setState({
          LoginMessage: messg
        });
      }   
    }else{
      this.setState({
        LoginMessage: "Enter a proper email and password"
      }, ()=>{
        if(this.state.LoginMessage !== null && this.state.LoginMessage !== undefined && this.state.LoginMessage !== "") {
          this.setState({
            hidden: false
          });
        }
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
      }, ()=> {
        if(this.state.LoginMessage === null || this.state.LoginMessage === undefined || this.state.LoginMessage === "") {
          this.setState({
            hidden: true
          });
        }
      });
    }else{
      this.setState({
        email: null,
        LoginMessage: "Please enter an email address"
      }, ()=>{
        if(this.state.LoginMessage !== null && this.state.LoginMessage !== undefined && this.state.LoginMessage !== "") {
          this.setState({
            hidden: false
          });
        }
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
      }, ()=> {
        if(this.state.LoginMessage === null || this.state.LoginMessage === undefined || this.state.LoginMessage === "") {
          this.setState({
            hidden: true
          });
        }
      });
    }else{
      this.setState({
        Lpass: null,
        LoginMessage: "Your password should be 8 or more characters"
      }, ()=>{
        if(this.state.LoginMessage !== null && this.state.LoginMessage !== undefined && this.state.LoginMessage !== "") {
          this.setState({
            hidden: false
          });
        }
      });
    }
  }
  handlePassConf(event){
    let cPass = event.target.value;
    if(cPass !== null) {
      let pass = this.state.Lpass===undefined || this.state.Lpass===null ?"": this.state.Lpass;
      if(pass != null && cPass != pass) {
        this.setState({
          LoginMessage: "Your passwords should match"
        }, ()=>{
          if(this.state.LoginMessage !== null && this.state.LoginMessage !== undefined && this.state.LoginMessage !== "") {
            this.setState({
              hidden: false
            });
          }
        });
      }else{
        this.setState({
          PassCon: cPass,
          LoginMessage: null
        }, ()=> {
          if(this.state.LoginMessage === null || this.state.LoginMessage === undefined || this.state.LoginMessage === "") {
            this.setState({
              hidden: true
            });
          }
        }); 
      }
    } 
  }
  goToLogin(){
    this.setState({
      exists: null,
      reset: null
    });
    localStorage.setItem('exists', null);
    localStorage.setItem('reset', null);
  }
  goToReset(){
    this.setState({
      reset: true,
      exists: null
    });
    localStorage.setItem('reset', true);
    localStorage.setItem('exists', null);
  }
  goToReg(){
    this.setState({
      exists: false,
      reset: null
    });
    localStorage.setItem('exists', false);
    localStorage.setItem('reset', null);
  }
  eSignup(email, password){
    app.auth().createUserWithEmailAndPassword(email, password).then(()=>{
      this.setState({
        exists: null,
        LoginMessage: "You Successfully Registered"
      }, ()=>{
        if(this.state.LoginMessage !== null && this.state.LoginMessage !== undefined && this.state.LoginMessage !== "") {
          this.setState({
            hidden: false
          });
        }
      });
    }, (error)=>{
      this.setState({
        LoginMessage: error.message,
        exists: false
      }, ()=>{
        if(this.state.LoginMessage !== null && this.state.LoginMessage !== undefined && this.state.LoginMessage !== "") {
          this.setState({
            hidden: false
          });
        }
      });
    });
  }
  eReset(email){
    app.auth().sendPasswordResetEmail(email).then(()=>{
      this.setState({
        LoginMessage: "We sent you a reset email, please check your inbox"
      }, ()=>{
        if(this.state.LoginMessage !== null && this.state.LoginMessage !== undefined && this.state.LoginMessage !== "") {
          this.setState({
            hidden: false
          });
        }
      });
    }, (error)=>{
      this.setState({
        LoginMessage: error.message,
        exists: false
      }, ()=>{
        if(this.state.LoginMessage !== null && this.state.LoginMessage !== undefined && this.state.LoginMessage !== "") {
          this.setState({
            hidden: false
          });
        }
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
        LoginMessage: null,
        hidden: true
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
      }, ()=>{
        if(this.state.LoginMessage !== null && this.state.LoginMessage !== undefined && this.state.LoginMessage !== "") {
          this.setState({
            hidden: false
          });
        }
      });
    });
  }
  authenticate(provider, callback){
    app.auth().signInWithPopup(provider).then(callback, (error)=>{
      this.setState({
        LoginMessage: error.message
      }, ()=>{
        if(this.state.LoginMessage !== null && this.state.LoginMessage !== undefined && this.state.LoginMessage !== "") {
          this.setState({
            hidden: false
          });
        }
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
      dname: name,
      LoginMessage: null,
      hidden: true
    });
    let exists = this.state.exists || null;
    let dname = this.state.dname;
    let Lemail = this.state.Lemail || null;
    let states = [uid, exists,email,dname,Lemail];
    let statesS = ['uid', 'exists','email','dname','Lemail'];
    let len = states.length;
    for(var count=0;count<len; count++){
      localStorage.setItem(statesS[count], states[count]);
    }
  }
  renderLogin(){
    const fbAuth = new Firebase.auth.FacebookAuthProvider();
    const googleAuth = new Firebase.auth.GoogleAuthProvider();
    const Reg = <span className="link" onClick={()=>this.goToReg()}>Register</span>;
    const pReset = <span className="link" onClick={()=>this.goToReset()}>Forgot Passowrd</span>;
    let feedBack = this.state.hidden === true?"hidden":"feedBack";
    return(
      <div>
        <span><h3>Sign in</h3></span>
        <span className={ feedBack }>{this.state.LoginMessage}</span>
        <Login onsubmit={this.handleLogin} userEmail={this.handleEmail} pass={this.handlePass}/>
        { Reg }  { pReset }
        <span><button id="facebook" className="icon-facebook-squared" onClick={()=>this.authenticate(fbAuth, this.authHandler)}> &nbsp;Sign in with Facebook</button></span>
        <span><button id="google" className="icon-google" onClick={()=>this.authenticate(googleAuth, this.authHandler)}> &nbsp;Sign in with Google</button></span>
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
    let feedBack = this.state.hidden === true?"hidden":"feedBack";
    if(this.state.uid !== null) {
      return(
        <div className="Home">
          <Home logout={logout} dname={this.state.dname} email={this.state.email} />
        </div>
      )
    }else if(this.state.exists === false){
      return(
        <div className="App">
          <Signup feedback={feedBack} message={this.state.LoginMessage} onsignup={this.handleSignup} userEmail={this.handleEmail} pass={this.handlePass} conPass={this.handlePassConf} reset={this.goToReset} onLogin={this.goToLogin} />
        </div>
      )
    }else if(this.state.reset === true) {
      return(
        <div className="App">
          <Reset feedback={feedBack} onReset={this.handleReset} message={this.state.LoginMessage}  userEmail={this.handleEmail} toReg={this.goToReg} onLogin={this.goToLogin}/>
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
