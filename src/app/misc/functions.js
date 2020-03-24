import Rebase from 're-base';
import app from './base';
import Firebase from 'firebase/app';
const base = Rebase.createClass(app.database());
const storage = Firebase.storage();
const storageRef = storage.ref();

export const getUserAvatar = userId => {
    return new Promise(resolve => {
        base.fetch(`users/${ userId }`, {
            context: this,
            asArray: true,
            then(data){
                let len = data.length;
                if ( len !== 0) {
                    let fl = data[1][0];
                    let avURL = data[1];
                    if (fl === "h") {
                        localStorage.setItem('avatar', avURL);
                        resolve(avURL);
                    }
                    else {
                        //use generic avatar
                        resolve(setGenericAvatar());
                    }
                }
                else {
                    //use generic avatar
                    resolve(setGenericAvatar());
                }
            }
        }); 
    }); 
}

export const checkUserLoggedIn = userId => {
    return new Promise(resolve => {
        const usersRef = app.database().ref('users');
        base.fetch(`users/${ userId }`, {
            context: this,
            asArray: false,
            then(data){
                let len = Object.keys(data).length;
                if (len !== 0) {
                    const { online } = data;
                    if (online) resolve(true);
                    else {
                        usersRef.child(`${userId}`).update({
                            online: true,
                        });
                        resolve(false);
                    }
                }
            }
        }); 
    });
}

export const dbLogout = userId => {
    return new Promise(resolve => {
        const usersRef = app.database().ref('users');
        if (userId) {
            usersRef.child(`${userId}`).update({
                online: false,
            }).catch(e => {
                console.log(e.message);
                resolve(false);
            })
            resolve(true);
        }
        else resolve(false);
    });
}

export const setGenericAvatar = () => {
    storageRef.child('general/avatar.jpg').getDownloadURL().then((url)=>{
        console.log("generic avatar set");
        localStorage.setItem('avatar', url);
        return url;
    });
}

export const setChatId = uid => {
    try{
        if (uid) usersRef.child(uid).update({chatkit_uid: uid});
    }catch(e){
        console.log(e.message);
    }
}
