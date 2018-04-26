import React, { Component } from 'react';
import './styles/App.css';
import app from './base';
import Firebase from 'firebase';
import Rebase from 're-base';
import Home from './components/Home';
import Login from './components/Login';
import Reset from './components/Reset';
import Signup from './components/Signup';
import Settings from './components/Settings';
import Header from './components/Header';
import Friends from './components/Friends';
let base = Rebase.createClass(app.database());
var storage = Firebase.storage();
var storageRef = storage.ref();

class App extends Component {
  
  constructor(props){
    super(props);
    this.authHandler = this.authHandler.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.state = {
      uid: null,
      hidden: true,
      home: true,
      settings: null,
      appUsers: null
    }
    this.baseState = this.state;
  }
  componentWillMount(){
    let uid = localStorage.getItem("uid")==="null"?null:localStorage.getItem("uid");
    let dname = localStorage.getItem("dname")==="null"?null:localStorage.getItem("dname");
    let email = localStorage.getItem("email")==="null"?null:localStorage.getItem("email");
    let exists = localStorage.getItem("exists")==="null"?null:localStorage.getItem("exists")==="false"?false:localStorage.getItem("exists");
    let reset = localStorage.getItem("reset")==="null"?null:localStorage.getItem("reset")==="true"?true:localStorage.getItem("reset");
    let settings = localStorage.getItem("settings")==="null"?null:localStorage.getItem("settings")==="true"?true:localStorage.getItem("settings");
    let home = localStorage.getItem("home")==="null"?null:localStorage.getItem("home")==="true"?true:true;
    let appUsers = localStorage.getItem("appUsers")==="null"?null:localStorage.getItem("appUsers")==="true"?true:localStorage.getItem("appUsers");
    if(uid !== null && exists === null) {
      this.setState({
        uid: uid,
        dname: dname,
        email: email,
        exists: exists,
        settings: settings,
        home: home,
        appUsers: appUsers
      });
    }else if(uid === null && exists !==null){
      this.setState({
        exists: exists
      });
    }else if(uid === null && reset === true){
      this.setState({
        reset: reset
      });
    }
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
  authenticate(provider, callback){
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
  authHandler(authData){
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
  logout = ()=>{
    app.auth().signOut().then(()=>{
      this.setState({
        uid:null,
        Lemail:null,
        email: null,
        dname:null,
        Lpass:null,
        home:true,
        appUsers: null,
        settings: null,
        avatar: null
      });
      let statesS = ['uid', 'exists','email','dname','Lemail','home','appUsers','settings', 'avatar'];
      let len = statesS.length;
      for(var count=0;count<len; count++){
        localStorage.removeItem(statesS[count]);
      }
      console.log("user signed out!");
    })
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
  render() {
    const logout = <span className="logout" onClick={this.logout}>Logout</span>;
    const settings = <span className="link" onClick={this.settings} >Settings</span>
    const header = <Header dname={ this.state.dname } userId={ this.state.uid } appUsers={ this.appUsers } home={ this.home } settings={settings} logout={logout}/>;
    let feedBack = this.state.hidden === true?"hidden":"feedBack";
    if(this.state.uid !== null && this.state.uid !== undefined) {
      if(this.state.home === true )
      {
        return(
          <div className="Home">
            <Home avatar={ this.state.avatar } header={header} logout={logout} dname={this.state.dname} uid={ this.state.uid } email={this.state.email} settings={settings} />
          </div>
        )
      }else if(this.state.settings === true){
        return(
          <Settings header={header} settings={settings} logout={logout}/>
        )
      }else if(this.state.appUsers === true){
        return(
          <Friends dname={ this.state.dname } header={ header } userId={ this.state.uid } />
        )
      }
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
