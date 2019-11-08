import Firebase from 'firebase/app';
import Rebase from 're-base';
import axios from 'axios';
import app from '../../base';
import { emailregex } from 'misc/constants';
import { dispatchedGenInfo, dispatchChatkitTokenId } from 'reduxFiles/dispatchers/genDispatchers';
import { getUserAvatar } from 'misc/functions';
import { 
    LOGIN_FULFILLED,
    LOGIN_PENDING, 
    LOGIN_REJECTED, 
    STORE_EMAIL, STORE_PASSWORD, 
    LOGIN_ERROR_ALERT, 
    LOGIN_CONFIRMED,
    LOGOUT_CONFIRMED,
    SIGNUP_FULFILLED, 
    SIGNUP_REJECTED, 
    SIGNUP_PENDING,
    SIGNUP_ERROR_ALERT,
    SIGNUP_CONFIRMED,
    PASSWORDS_MATCH,
    PASSWORDS_MATCH_ERROR
} from '../types';

const confirmTokenURL = process.env.CONFIRM_FIREBASE_TOKEN;
const base = Rebase.createClass(app.database());
const storage = Firebase.storage();
const storageRef = storage.ref();


export const storeEmail = email =>{
    return {
        type: STORE_EMAIL,
        payload: email
    }
}

export const storePassword = password =>{
    return {
        type: STORE_PASSWORD,
        payload: password
    }
}

export const confirmPasswordMatch = password =>{
    return {
        type: PASSWORDS_MATCH,
        payload: password
    }
}

export const passwordMatchError = messageId =>{
    return {
        type: PASSWORDS_MATCH_ERROR,
        payload: messageId
    }
}

export const loginPending = () => {
    return {
        type: LOGIN_PENDING
    }
}

export const loginFulfilled = userInfo => {
    return {
        type: LOGIN_FULFILLED,
        payload: userInfo
    }
}

export const loginConfirmed = () => {
    return {
        type: LOGIN_CONFIRMED
    }
}

export const logoutConfirmed = () => {
    return {
        type: LOGOUT_CONFIRMED
    }
}

export const loginFailed = messageId => {
    return {
        type: LOGIN_REJECTED,
        payload: messageId
    }
}

export const loginErrorAlert = messageId => {
    return {
        type: LOGIN_ERROR_ALERT,
        payload: messageId
    }
}

export const signupErrorAlert = messageId => {
    return {
        type: SIGNUP_ERROR_ALERT,
        payload: messageId
    }
}

export const handleEmail = email => {
    return dispatch => {
        if(email.match(emailregex)){
            dispatch(storeEmail(email));
        }else{
            console.log("wrong format");
            let messageId="error.emailFormat";
            dispatch(loginErrorAlert(messageId));
        }
    }
    
}

export const handlePassword = pass => {
    return dispatch => {
        let passLen = pass.length;
        if(passLen >= 8){
            dispatch(storePassword(pass));
        }else{
            let messageId = "error.passwordLength";
            dispatch(loginErrorAlert(messageId));
        }
    }
}

export const handleConfirmPassword = (pass, confirmPass) => {
    return dispatch => {
        let confirmPassLen  = confirmPass.length;
        if( confirmPassLen >= 8 &&  pass === confirmPass ){
            dispatch(confirmPasswordMatch(pass));
        }else{
            let messageId = "error.passwordMatchError";
            dispatch(signupErrorAlert(messageId));
        }
    }
}

export const handleLogin = loginInfo => {
    return dispatch => {
        let { email, password } = loginInfo;
        if(email && password){
            dispatch(loginPending());
            dispatch(eAuthenticate(email, password)); 
        }else{
            dispatch(loginErrorAlert("error.noCredentials"));
        } 
    }    
}

export const authHandler = (authData, fetchToken) => {
    return dispatch => {
        let currentUser = app.auth().currentUser;
        const uid= authData.user.uid;
        //console.log(currentUser)
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        getUserAvatar(uid).then(url=>{
            const displayName= authData.user.displayName;
            const email= authData.user.email;
            const avURL = url || authData.user.photoURL;
            const userLoginInfo = {uid,email,displayName,avURL,chatkitUser: {}};
            const states = [uid,email,displayName];
            const statesS = ['uid','email','displayName'];
            const len = states.length;
            dispatch(dispatchedGenInfo(userLoginInfo));
            dispatch(fetchToken(currentUser, userLoginInfo));
            for(var count=0;count<len; count++){
                localStorage.setItem(statesS[count], states[count]);
            }
            dispatch(loginFulfilled(userLoginInfo));
        });
    }
}

export const  authenticate = (provider, callback, fetchToken) => {
    return dispatch => {
        app.auth().signInWithPopup(provider).then((data)=>callback(data, fetchToken)).catch((error)=>{
            console.log(error);
            let errorMessage; 
            error.code === "auth/network-request-failed"?
            errorMessage = "error.networkError":
            errorMessage = "error.loginFailure";

            dispatch(loginErrorAlert(errorMessage));
        });
    }
}

export const eAuthenticate = (email, password)=>{
    return dispatch => {
        app.auth().signInWithEmailAndPassword(email, password).then(()=>{
            let currUser = app.auth().currentUser;
            let uid = currUser.uid;
            localStorage.setItem('currentUser', JSON.stringify(currUser));
            
            getUserAvatar(uid).then(url=>{
                let email = currUser.email;
                let splitEmailAdd = email.split('@');
                let avURL = url;
                let displayName = splitEmailAdd[0];
                let userInfo = { uid,email,displayName,avURL,chatkitUser: {} };
                let states = [uid,email,displayName];
                let statesS = ['uid','email','displayName'];
                let len = states.length;
                dispatch(dispatchedGenInfo(userInfo));
                dispatch(fetchToken(currUser, userInfo));
                for(var count=0;count<len; count++){
                    localStorage.setItem(statesS[count], states[count]);
                }
                dispatch(loginFulfilled(userInfo));
            });
        }).catch((error)=>{
            let errorCode = error.code;
            let errorMessage;
            if( errorCode === "auth/wrong-password" )
                errorMessage = "error.invalidPassword";
            else 
                errorMessage = "error.loginFailure";

            dispatch(loginFailed(errorMessage));
            console.log(error)
        });
    }
}

export const confirmToken = (tokeId) => {
    return dispatch => {
        const url = confirmTokenURL + tokeId;
        axios.post(url).then(result => {
            let { data } = result;
            let { error } = data;

            if( error.code && code === "auth/argument-error"){
                dispatch(loginErrorAlert("error.sessionExpired"));
            }else{
                dispatch(loginConfirmed());
            }
        }).catch(error=>{
            console.log(error.message)
            dispatch(loginErrorAlert("error.loginFailure"));
        });
    }
}

export const fetchToken = (currUser, userInfo)=>{
    return dispatch => {
        currUser.getIdToken(true).then( idToken=>{
            let genInfo = { ...userInfo };
            genInfo.chatkitUser.token = idToken;
            sessionStorage.setItem('genInfo', JSON.stringify(genInfo));
            dispatch(dispatchedGenInfo(genInfo));
            dispatch(dispatchChatkitTokenId(idToken));
        }).catch(error => {
            console.log(error);
        });
    } 
}

export const logout = genInfo =>{
    return dispatch => {
        genInfo.info = {};
        app.auth().signOut().then(()=>{
            sessionStorage.removeItem('genInfo');
            localStorage.clear();
            dispatch(dispatchedGenInfo(genInfo));
            dispatch(logoutConfirmed());
            console.log("user signed out!");
        });
    }
}