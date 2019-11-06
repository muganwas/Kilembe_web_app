import React, { Component } from 'react';
import PropTypes from 'prop-types';
//import axios from 'axios';
//redux
import { connect } from 'react-redux';
import { dispatchedGenInfo } from 'reduxFiles/dispatchers/genDispatchers';
import { confirmToken } from 'reduxFiles/dispatchers/authDispatchers';

import './styles/App.css';
import app from './base';
import Firebase from 'firebase';
import Rebase from 're-base';
import {
  Home,
  Login,
  Reset,
  Signup,
  Settings,
  Header,
  Messaging,
  Friends
} from 'components';
import { withRouter } from 'react-router-dom';

const base = Rebase.createClass(app.database());
const storage = Firebase.storage();
const storageRef = storage.ref();

class App extends Component {

  componentDidMount(){
    let storedInfo = sessionStorage.getItem("genInfo");
    //if stored info is present pickout session token
    let sessionToken = storedInfo?JSON.parse(storedInfo).chatkitUser.token:null;
    let { checkSessionValidity, chatkitUser } = this.props;

    let uid = localStorage.getItem("uid")==="null"?
    null:
    localStorage.getItem("uid");

    let exists = localStorage.getItem("exists")==="null"?
    null:
    localStorage.getItem("exists")==="false"?
    false:
    localStorage.getItem("exists");
    
    /**Determine page to redirect to */
    if(uid !== null) {
      //check if user session is still valid
      checkSessionValidity(sessionToken);
      this.goTo("/home");
    }else if(uid === null && exists === null){
      this.goTo("/login");
    }else if(uid === null && exists === false ){
      this.goTo("/signup");
    }

    let len = chatkitUser?Object.keys(chatkitUser).length:0;
    if(len === 0){
      /**Fetch chatkit info from local storage */
      let genInfo = JSON.parse(sessionStorage.getItem('genInfo'));
      this.props.sendGenInfo(genInfo);
    }
  }

  goTo = (location) => {
    const { history } = this.props;
    history.push(location);
  } 
 
  handleLogin = (event)=>{
    event.preventDefault();
    let email = this.state.email;
    let password = this.state.Lpass;
    if((email !== null && email !== "") && (password !== null && password !== "")){ 
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

  handleReset = ()=>{
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

  handleSignup = ()=>{
    let email = this.state.email;
    let password = this.state.Lpass;
    if((email !== null && email !== "") && (password != null && password !== "")){
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

  handleEmail = (event)=>{
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

  handlePass = (event)=>{
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

  handlePassConf = (event)=>{
    let cPass = event.target.value;
    if(cPass !== null) {
      let pass = this.state.Lpass===undefined || this.state.Lpass===null?"": this.state.Lpass;
      if(pass !== null && cPass !== pass) {
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

  goToLogin = ()=>{
    this.setState({
      exists: null,
      reset: null
    });
    localStorage.setItem('exists', null);
    localStorage.setItem('reset', null);
  }

  goToReset = ()=>{
    this.setState({
      reset: true,
      exists: null
    });
    localStorage.setItem('reset', true);
    localStorage.setItem('exists', null);
  }

  goToReg = ()=>{
    this.setState({
      exists: false,
      reset: null
    });
    localStorage.setItem('exists', false);
    localStorage.setItem('reset', null);
  }

  eSignup = (email, password)=>{
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
    }).catch((error)=>{
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

  eReset = (email)=>{
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
    }).catch((error)=>{
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

  eAuthenticate = (temail, password)=>{
    app.auth().signInWithEmailAndPassword(temail, password).then(()=>{
      let currUser = app.auth().currentUser;
      let info = this.props.genInfo.info;
      info.loggedInUser = currUser;
      this.props.sendGenInfo(info);
      this.fetchToken(currUser);
      localStorage.setItem('currentUser', JSON.stringify(currUser));
      let uid = currUser.uid;
      let email = currUser.email;
      let Rname = email.split('@');
      let name = Rname[0];
      this.getUserAv(uid);
      this.setState({
        uid: uid,
        dname: name,
        LoginMessage: null,
        hidden: true,
        playlist: {}
      });
      let exists = this.state.exists || null;
      let dname = this.state.dname;
      let Lemail = this.state.Lemail;
      let states = [uid, exists,email,dname,Lemail];
      let statesS = ['uid', 'exists','email','dname','Lemail'];
      let len = states.length;
      for(var count=0;count<len; count++){
        localStorage.setItem(statesS[count], states[count]);
      }
      localStorage.setItem('playlist', JSON.stringify(this.state.playlist));
    }).catch((error)=>{
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

  authenticate = (provider, callback) => {
    app.auth().signInWithPopup(provider).then(callback).catch((error)=>{
      console.log(error);
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

  getUserAv = (userId)=>{
    base.fetch(`users/${ userId }`, {
        context: this,
        asArray: true,
        then(data){
          let len = data.length;
          if( len !== 0){
            let fl = data[1][0];
            let avURL = data[1];
            if(fl === "h"){
              this.setState({
                avatar: avURL
              });
              localStorage.setItem('avatar', avURL);
            }else{
              storageRef.child('general/avatar.jpg').getDownloadURL().then((data)=>{
                this.setState({
                  avatar: data
                });
                localStorage.setItem('avatar', data);
              });
            }
          }
        }
    });  
  }

  fetchToken = (currUser)=>{
    currUser.getIdToken(true).then((idToken)=>{
      let genInfo = {...this.props.genInfo.info};
      genInfo.chatkitUser.token = idToken;
      sessionStorage.setItem('genInfo', JSON.stringify(genInfo));
      this.props.sendGenInfo(genInfo);
    }).catch(function(error) {
      console.log(error)
    });
  }

  authHandler = (authData)=>{
    let currentUser = app.auth().currentUser;
    let info = this.props.genInfo.info;
    info.loggedInUser = currentUser;
    this.props.sendGenInfo(info);
    this.fetchToken(currentUser);
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    const uid= authData.user.uid;
    const name= authData.user.displayName;
    const email= authData.user.email;
    this.getUserAv(uid);
    this.setState({
      uid: uid,
      email: email,
      dname: name,
      LoginMessage: null,
      hidden: true,
      playlist: {}
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
    localStorage.setItem('playlist', JSON.stringify(this.state.playlist));
  }
  renderLogin = ()=>{
    let { hidden } = this.state;
    const fbAuth = new Firebase.auth.FacebookAuthProvider();
    const googleAuth = new Firebase.auth.GoogleAuthProvider();
    let feedBack = hidden?"hidden":"feedBack";
    return(
      <div className="form">
        <span><h3>Sign in</h3></span>
        <span className={ feedBack }>{this.state.LoginMessage}</span>
        <Login onsubmit={this.handleLogin} handleEmail={this.handleEmail} handlePass={this.handlePass}/>
        <span className="link" onClick={()=>this.goToReg()}>Register</span>
        <span className="link" onClick={()=>this.goToReset()}>Forgot Passowrd</span>
        <span><button id="facebook" className="icon-facebook-squared" onClick={()=>this.authenticate(fbAuth, this.authHandler)}> &nbsp;Sign in with Facebook</button></span>
        <span><button id="google" className="icon-google" onClick={()=>this.authenticate(googleAuth, this.authHandler)}> &nbsp;Sign in with Google</button></span>
      </div>
    )
  }

  settings = ()=>{
    localStorage.setItem('settings', true);
    localStorage.setItem('home', null);
    localStorage.setItem('appUsers', null);
    this.setState({
      settings: true,
      home: null,
      appUsers: null
    });
  }
  home = ()=>{
    localStorage.setItem('settings', null);
    localStorage.setItem('home', true);
    localStorage.setItem('appUsers', null);
      this.setState({
        settings: null,
        home: true,
        appUsers: null
      });
  }
  appUsers = ()=>{
    localStorage.setItem('settings', null);
    localStorage.setItem('home', null);
    localStorage.setItem('appUsers', true);
      this.setState({
        settings: null,
        home: null,
        appUsers: true
      });
  }
  messaging = ()=>{
    localStorage.setItem('settings', null);
    localStorage.setItem('home', null);
    localStorage.setItem('appUsers', null);
    localStorage.setItem('messaging', true);
      this.setState({
        settings: null,
        home: null,
        appUsers: null,
        messaging: true
      });
  }
  render() {
    return false;
  }
}

App.propTypes = {
  genInfo: PropTypes.object,
  info: PropTypes.object,
  loginInfo: PropTypes.object,
  chatkitUser: PropTypes.object
}
const mapStateToProps = state => {
  return {
    genInfo: state.genInfo,
    info: state.genInfo.info,
    chatkitUser: state.genInfo.info.chatkitUser,
    loginInfo: state.loginInfo
  }
}

const mapDispatchToProps = dispatch => {
  return {
    checkSessionValidity: sessionToken => {
      dispatch(confirmToken(sessionToken));
    },
    sendGenInfo: genInfo => {
      dispatch(dispatchedGenInfo(genInfo));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
