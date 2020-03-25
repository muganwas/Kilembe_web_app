import axios from 'axios';
import app from 'misc/base';
import Rebase from 're-base';
import { emailregex } from 'misc/constants';
import { 
    dispatchedGenInfo, 
    dispatchChatkitTokenId, 
    fetchGenInfoFromlocalStorage 
} from 'reduxFiles/dispatchers/genDispatchers';
import { 
    getUserAvatar, 
    checkUserLoggedIn, 
    dbLogout 
} from 'misc/functions';
import { disableConsoleLog } from 'misc/helpers';
import { 
    LOGIN_FULFILLED,
    LOGIN_PENDING, 
    LOGIN_REJECTED, 
    STORE_EMAIL, 
    STORE_PASSWORD, 
    LOGIN_ERROR_ALERT, 
    LOGIN_CONFIRMED,
    LOGOUT_CONFIRMED,
    SIGNUP_FULFILLED,
    RESET_FULLFILLED,
    RESET_PENDING,
    RESET_REJECTED, 
    RESET_MESSAGE_ALERT,
    SIGNUP_REJECTED, 
    SIGNUP_PENDING,
    SIGNUP_ERROR_ALERT,
    SIGNUP_CONFIRMED,
    PASSWORDS_MATCH,
    PASSWORDS_MATCH_ERROR,
    CLEAR_ERRORS,
    USER_SAVED_IN_DATABASE,
    SOCKET_CONNECTED,
    SOCKET_DISCONNECTED,
    SOCKET_ERROR,
    UNAUTHORIZED_AUTHENTICATION,
    UPDATE_LOGGEDIN_ELSEWHERE
} from '../types';
import io from 'socket.io-client';
// import { setChatId } from '../../misc/functions';
const chatServerUrl = process.env.CHAT_SERVER;
export const socket = io(chatServerUrl, { autoConnect: false, transports: ['websocket'] });

const confirmTokenURL = process.env.CONFIRM_FIREBASE_TOKEN;
let base = Rebase.createClass(app.database());
let usersRef = app.database().ref('users');

//disable console.log in production 
disableConsoleLog();

export const storeEmail = email => {
    return {
        type: STORE_EMAIL,
        payload: email
    }
}

export const storePassword = password => {
    return {
        type: STORE_PASSWORD,
        payload: password
    }
}

export const confirmPasswordMatch = password => {
    return {
        type: PASSWORDS_MATCH,
        payload: password
    }
}

export const passwordMatchError = messageId => {
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

export const signupPending = () => {
    return {
        type: SIGNUP_PENDING
    }
}

export const signupRejected = messageId => {
    return {
        type: SIGNUP_REJECTED,
        payload: messageId
    }
}

export const userSaveIntoDB = () => {
    return {
        type: USER_SAVED_IN_DATABASE
    }
}

export const clearErrors = () => {
    return {
        type: CLEAR_ERRORS
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

export const signupFullfilled = userInfo => {
    return {
        type: SIGNUP_FULFILLED,
        payload: userInfo
    }
}

export const signupConfirmed = () => {
    return {
        type: SIGNUP_CONFIRMED
    }
}

export const signupMessageAlert = messageId => {
    return {
        type: SIGNUP_ERROR_ALERT,
        payload: messageId
    }
}

export const resetPending = () => {
    return {
        type: RESET_PENDING
    }
}

export const resetFullfilled = messageId => {
    return {
        type: RESET_FULLFILLED,
        payload: messageId
    }
}

export const resetRejected = messageId => {
    return {
        type: RESET_REJECTED,
        payload: messageId
    }
}

export const resetMessageAlert = messageId => {
    return {
        type: RESET_MESSAGE_ALERT,
        payload: messageId
    }
}

export const socketConnected = () => {
    return {
        type: SOCKET_CONNECTED
    }
}

export const socketDisconnected = () => {
    return {
        type: SOCKET_DISCONNECTED
    }
}

export const socketError = error => {
    return {
        type: SOCKET_ERROR,
        payload: error
    }
}

export const unAuthorizedAuthentication = () => {
    return {
        type: UNAUTHORIZED_AUTHENTICATION
    }
}

export const updateLoggedInElsewhere = (loggedInElsewhere, tempUID) => {
    return {
        type: UPDATE_LOGGEDIN_ELSEWHERE,
        payload: {loggedInElsewhere, tempUID}
    }
}

export const handleEmail = email => {
    return dispatch => {
        if (email && email.match(emailregex)) {
            dispatch(storeEmail(email));
        }
        else if (email && !email.match(emailregex)){
            let messageId="error.emailFormat";
            dispatch(resetMessageAlert(messageId));
            dispatch(signupMessageAlert(messageId));
            dispatch(loginErrorAlert(messageId));
        }
    }
}

export const handlePassword = pass => {
    return dispatch => {
        let passLen = pass.length;
        if (pass && passLen >= 8) {
            dispatch(storePassword(pass));
        }
        else if (pass && passLen < 8) {
            let messageId = "error.passwordLength";
            dispatch(signupMessageAlert(messageId));
            dispatch(loginErrorAlert(messageId));
        }
    }
}

export const handleConfirmPassword = (pass, confirmPass) => {
    return dispatch => {
        let confirmPassLen  = confirmPass.length;
        if ( confirmPass && confirmPassLen >= 8 && pass === confirmPass ) {
            dispatch(confirmPasswordMatch(pass));
        }
        else if (confirmPass && confirmPassLen >= 8 && pass !== confirmPass) {
            let messageId = "error.passwordMatchError";
            dispatch(signupMessageAlert(messageId));
        }
        else if (confirmPass && confirmPassLen < 8) {
            let messageId = "error.confirmPasswordShort";
            dispatch(signupMessageAlert(messageId));
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

export const authHandler = authData => {
    return dispatch => {
        const currentUser = app.auth().currentUser;
        const uid = authData.user.uid;
        const { additionalUserInfo: { profile: { verified_email } } } = authData;
        const i = false;
        //console.log(currentUser)
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        if (verified_email) {
            checkUserLoggedIn(uid).then( loggedIn => {
                if (!loggedIn){
                    getUserAvatar(uid).then(url => {
                        const displayName= authData.user.displayName;
                        const email= authData.user.email;
                        const avURL = url || authData.user.photoURL;
                        const userLoginInfo = { uid, email, displayName, avURL, chatkitUser: {} };
                        const states = [ uid, email, displayName ];
                        const statesS = ['uid','email','displayName'];
                        const len = states.length;
                        dispatch(dispatchedGenInfo(userLoginInfo));
                        dispatch(fetchToken(currentUser, userLoginInfo));
                        for(var count = 0; count < len; count++){
                            localStorage.setItem(statesS[count], states[count]);
                        }
                        dispatch(loginFulfilled(userLoginInfo));
                    });
                }
                else {
                    dispatch(updateLoggedInElsewhere(true, uid));
                    dispatch(logout());
                }
            });
        }
        else {
            dispatch(loginFailed("error.userEmailNotVerified"));
            currentUser.sendEmailVerification().then(() => {
                console.log("verfication email sent");
            });
        }
    }
}

export const authenticate = (provider, callback) => {
    return dispatch => {
        app.auth().
        signInWithPopup(provider).
        then(data => callback(data, fetchToken)).
        catch(error => {
            //console.log(error);
            let errorMessage; 
            error.code === "auth/network-request-failed"?
            errorMessage = "error.networkError":
            errorMessage = "error.loginFailure";

            dispatch(loginErrorAlert(errorMessage));
        });
    }
}

export const eAuthenticate = (email, password) => {
    return dispatch => {
        app.auth().signInWithEmailAndPassword(email, password).then(response => {
            //console.log(response)
            const { user } = response;
            const { emailVerified } = user;
            let currUser = user;
            if (emailVerified) {
                let uid = currUser.uid;
                localStorage.setItem('currentUser', JSON.stringify(currUser));
                checkUserLoggedIn(uid).then(loggedIn => {
                    if (!loggedIn) {
                        getUserAvatar(uid).then(url => {
                            console.log(url);
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
                            for (var count = 0; count < len; count++) {
                                localStorage.setItem(statesS[count], states[count]);
                            }
                            dispatch(loginFulfilled(userInfo));
                        });
                    }
                    else {
                        dispatch(updateLoggedInElsewhere(true, uid));
                        dispatch(logout());
                    }
                });
            }
            else {
                dispatch(loginFailed("error.userEmailNotVerified"));
                user.sendEmailVerification().then(()=>{
                    console.log("verfication email sent");
                });
            }
        }).catch(error => {
            let errorCode = error.code;
            let errorMessage;
            if( errorCode === "auth/wrong-password" )
                errorMessage = "error.invalidPassword";
            else 
                errorMessage = "error.loginFailure";

            dispatch(loginFailed(errorMessage));
            //console.log(error)
        });
    }
}

export const eSignup = (email, password)=>{
    return dispatch => {
        app.auth().createUserWithEmailAndPassword(email, password).then( response => {
            const { additionalUserInfo: { isNewUser }, user } = response;
            const { emailVerified } = user;
            if (isNewUser) {
                dispatch(signupFullfilled(response));
                dispatch(signupMessageAlert("message.successfulSignup"));
                !emailVerified? user.sendEmailVerification().then( () => {
                    dispatch(signupConfirmed());
                    console.log("Confirmation email sent...")
                }): null;
            }
            //console.log(emailVerified);
            //after signup
        }).catch(error => {
            //console.log(error);
            let errorMessage;
            let errorCode = error.code;
            errorMessage = errorCode === "auth/email-already-in-use"?
            "error.emailAlreadyInUse":
            "error.signupError"
            dispatch(signupRejected(errorMessage));
        });
    }
}

export const handlePasswordReset = email => {
    return dispatch => {
        if (email) {
            dispatch(resetPending());
            dispatch(eReset(email));  
        }
        else {
            dispatch(resetMessageAlert('error.noEmail'));
        } 
    }    
}

export const eReset = email => {
    return dispatch => {
        app.auth().sendPasswordResetEmail(email).then(() => {
            const messageId = "message.sentResetEmail";
            dispatch(resetFullfilled(messageId));
        }).catch( error => {
            console.log(error)
            let errorMessage;
            let errorCode = error.code;
            errorMessage = errorCode === "auth/user-not-found"?
            "error.emailNotRegistered":
            errorCode === "auth/invalid-email"?
            "error.emailFormat":
            "error.resetFailure"
            dispatch(resetRejected(errorMessage));
        });
    }
}

export const setupUserInFirebase = (avatar, uid) => {
    return dispatch => {
        if ( avatar || localStorage.getItem("avatar")) {
            base.fetch(`users/${ uid }`, {
                context: this,
                asArray: true
            }).then(data => {
                // console.log(data)
                let length = data.length;
                if(length === 0 || length === null || length === undefined) {
                    // console.log(uid)
                    let ref = usersRef.child(uid);
                    let derivedDnameArr = localStorage.getItem('email').split('@');
                    let derivedDname = derivedDnameArr[0];
                    ref.set({
                        email: localStorage.getItem('email'),
                        dname: localStorage.getItem('dname') || derivedDname,
                        uid: localStorage.getItem('uid'),
                        chatkit_uid: uid,
                        about: " ",
                        shareEmailAddress: false,
                        avatar: localStorage.getItem("avatar") || avatar
                    });
                    dispatch(userSaveIntoDB());
                }
                else dispatch(userSaveIntoDB());
            });
        }
        else getUserAvatar(uid);      
    }
}

export const handleSignup = (email, password) => {
    return dispatch => {
        if (email && password) {
            dispatch(signupPending());
            dispatch(eSignup(email, password));  
        }
        else {
            dispatch(signupMessageAlert('error.noCredentials'));
        } 
    }    
}

export const confirmToken = tokenId => {
    return dispatch => {
        const url = confirmTokenURL + tokenId;
        if (tokenId) axios.post(url).then(result => {
                let { data } = result;
                let { error } = data;
                if (error) {
                    if (error.code === "auth/argument-error") {
                        dispatch(loginErrorAlert("error.sessionExpired"));
                        dispatch(logout());
                    }
                }
                else dispatch(loginConfirmed());
                
            }).catch(error => {
                console.log(error.message)
                dispatch(loginErrorAlert("error.loginFailure"));
                dispatch(logout());
            });
    }
}

export const fetchToken = (currUser, userInfo)=>{
    return dispatch => {
        currUser.getIdToken(true).then( idToken=>{
            let genInfo = { ...userInfo };
            genInfo.chatkitUser.token = idToken;
            localStorage.setItem('genInfo', JSON.stringify(genInfo));
            dispatch(dispatchedGenInfo(genInfo));
            dispatch(dispatchChatkitTokenId(idToken));
        }).catch(error => {
            console.log(error);
        });
    } 
}

export const checkLoginStatus = (confirmLoggedIn, loginInfo, info)=>{
    return dispatch => {
        const { loggedIn } = loginInfo;
        const genInfo = JSON.parse(localStorage.getItem('genInfo'));
        if (!loggedIn) {
            if (!info) {
                alert('no info')
                fetchGenInfoFromlocalStorage(confirmLoggedIn, loginInfo).then(res=>{
                    if (res === "not dispatched") {
                        dispatch(logout());
                    }
                    else {
                        const { chatkitUser: { token } } = genInfo;
                        dispatch(confirmToken(token));
                    }
                });
            }
            else {
                const { info: { chatkitUser: { token } } } = info;
                dispatch(confirmToken(token));
            }
        }
    }
}

export const logout = (elsewhere=false, altUID) => {
    return dispatch => {
        const storedInfo = localStorage.getItem('genInfo');
        const { uid } = storedInfo ? JSON.parse(storedInfo) : {};
        const finalUID = elsewhere && altUID ? altUID : uid;
        dbLogout(finalUID).then(loggedOut => {
            console.log(`logged out: ${loggedOut}`);
            if (loggedOut) {
                app.auth().signOut().then(() => {
                    localStorage.removeItem('genInfo');
                    localStorage.clear();
                    dispatch(logoutConfirmed());
                    socket.disconnect();
                    console.log("user signed out!");     
                });
            }
            else dispatch(loginErrorAlert("error.existingSession"));
        });
    }
}

export const connectToChatServer = props => {
    return dispatch => {
        const { genInfo: { info: { chatkitUser: { token } } }, loginInfo: { socketOpen } } = props;
        const storedInfo = JSON.parse(localStorage.getItem('genInfo'));
        const storedToken = storedInfo.chatkitUser.token;
        const remoteConnected = socket.connected;
        console.log('remote socket open: ' + remoteConnected);
        if ((token || storedToken) && !socketOpen) {
            console.log('opening socket...')
            socket.open();
            dispatch(socketConnected());
        }
    }
}

export const disconnectFromChatServer = () => {
    return dispatch => {
        socket.disconnect();
        dispatch(socketDisconnected());
    }
}

export const alertSocketError = error => {
    return dispatch => {
        // console.log('disconnected with error')
        console.log(error)
        //socket.disconnect();
        if (error.message && error.message === 'UNAUTHORIZED') dispatch(unAuthorizedAuthentication());
        if (error.code === 'auth/id-token-expired') {
            dispatch(logout());
        }
        dispatch(socketError(error));
    }
}