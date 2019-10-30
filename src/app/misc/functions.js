import Rebase from 're-base';
import app from '../../base';
const base = Rebase.createClass(app.database());

export const getUserAv = (userId)=>{
    return new Promise(resolve => {
        base.fetch(`users/${ userId }`, {
            context: this,
            asArray: true,
            then(data){
              let len = data.length;
              if( len !== 0){
                let fl = data[1][0];
                let avURL = data[1];
                if(fl === "h"){
                    localStorage.setItem('avatar', avURL);
                    resolve(avURL);
                }else{
                    //use generic avatar
                    storageRef.child('general/avatar.jpg').getDownloadURL().then((data)=>{
                        localStorage.setItem('avatar', data);
                        resolve(data);
                    });
                }
              }
            }
        }); 
    }); 
}