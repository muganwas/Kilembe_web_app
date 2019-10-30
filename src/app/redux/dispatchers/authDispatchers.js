import Firebase from 'firebase';
import Rebase from 're-base';
import app from '../../base';
import { emailregex } from 'misc/constants';
import { dispatchedGenInfo } from 'reduxFiles/dispatchers/genDispatchers';
import { getUserAv } from 'misc/functions'
import { LOGIN_FULFILLED, LOGIN_REJECTED, STORE_EMAIL, STORE_PASSWORD, LOGIN_ERROR_ALERT } from '../actions';

const base = Rebase.createClass(app.database());
const storage = Firebase.storage();
const storageRef = storage.ref();


export const storeEmail = email =>{
    return {
        action: STORE_EMAIL,
        payload: email
    }
}

export const storePassword = email =>{
    return {
        action: STORE_PASSWORD,
        payload: email
    }
}

export const loginFulfilled = userInfo => {
    return {
        action: LOGIN_FULFILLED,
        payload: userInfo
    }
}

export const loginFailed = messageId => {
    return {
        action: LOGIN_REJECTED,
        payload: messageId
    }
}

export const loginErrorAlert = messageId => {
    return {
        action: LOGIN_ERROR_ALERT,
        payload: messageId
    }
}

export const handleEmail = event => {
    return dispatch => {
        let email = event.target.value;
        if(emailAdd.match(emailregex)){
            dispatch(storeEmail(email));
        }else{
            let messageId="error.emailFormat";
            dispatch(loginErrorAlert(messageId));
        }
    }
}

export const handlePassword = event => {
    return dispatch => {
        let pass = event.target.value;
        let passLen = pass.length;
        if(passLen >= 8){
            dispatch(storePassword(pass));
        }else{
            let messageId = "error.passwordLength";
            dispatch(loginErrorAlert(messageId));
        }
    }
}

export const handleLogin = (email, password)=>{
    return dispatch => {
        if((email !== null && email !== "") && (password !== null && password !== "")){ 
            eAuthenticate(email, password); 
        }else{
            dispatch(loginErrorAlert("error.noCredentials"));
        } 
    }    
}

export const authHandler = authData => {
    return dispatch => {
        let currentUser = app.auth().currentUser;
        let info = this.props.genInfo.info;
        info.loggedInUser = currentUser;
        dispatch(dispatchedGenInfo(info));
        fetchToken(currentUser);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        getUserAv(uid).then(url=>{
            const uid= authData.user.uid;
            const displayName= authData.user.displayName;
            const email= authData.user.email;
            const avURL = url;
            const userLoginInfo = {uid,email,displayName,avURL};
            const states = [uid,email,displayName];
            const statesS = ['uid','email','displayName'];
            const len = states.length;
            for(var count=0;count<len; count++){
                localStorage.setItem(statesS[count], states[count]);
            }
            dispatch(loginFulfilled(userLoginInfo));
        });
    }
}

export const  authenticate = (provider, callback) => {
    return dispatch => {
        app.auth().signInWithPopup(provider).then(callback).catch((error)=>{
            console.log(error);
            dispatch(loginErrorAlert("error.loginFailure"));
        });
    }
}

export const eAuthenticate = (email, password)=>{
    return dispatch => {
        app.auth().signInWithEmailAndPassword(email, password).then(()=>{
            let currUser = app.auth().currentUser;
            let info = this.props.genInfo.info;
            info.loggedInUser = currUser;
            fetchToken(currUser);
            localStorage.setItem('currentUser', JSON.stringify(currUser));
            
            getUserAv(uid).then(url=>{
                let uid = currUser.uid;
                let email = currUser.email;
                let splitEmailAdd = email.split('@');
                let avURL = url;
                let displayName = splitEmailAdd[0];
                let userLoginInfo = {uid,email,displayName,avURL};
                let states = [uid,email,displayName];
                let statesS = ['uid','email','displayName'];
                let len = states.length;
                for(var count=0;count<len; count++){
                    localStorage.setItem(statesS[count], states[count]);
                }
                dispatch(loginFulfilled(userLoginInfo));
            });
        }).catch((error)=>{
            let errorMessage = error.message;
            dispatch(loginFailed("error.loginFailure"));
            console.log(errorMessage)
        });
    }
}

fetchToken = (currUser, userInfo)=>{
    currUser.getIdToken(true).then((idToken)=>{
        let genInfo = { ...userInfo };
        genInfo.chatkitUser.token = idToken;
        sessionStorage.setItem('genInfo', JSON.stringify(genInfo));
        dispatch(dispatchedGenInfo(genInfo));
    }).catch(error => {
        console.log(error);
    });
}