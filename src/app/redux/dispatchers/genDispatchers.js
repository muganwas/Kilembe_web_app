import { FETCH_GEN_FULFILLED, FETCH_GEN_REJECTED, FETCH_ID_TOKEN, UPDATE_ONLINE_STATUS } from '../types';

export const dispatchedGenInfo = info => {
    if(info !== undefined && info !== null){   
      return {
            type: FETCH_GEN_FULFILLED,
            payload: info
        }
    }else{
        return {
            type: FETCH_GEN_REJECTED,
            payload: {
                error: "could not fetch user details"
            }
        } 
    }
}

export const dispatchChatkitTokenId = token => {
    return {
        type: FETCH_ID_TOKEN,
        payload: token
    }
}

export const fetchGenInfoFromlocalStorage = (confirmLoggedIn, loginInfo) => {
    return new Promise(resolve => {
        let { loggedIn } = loginInfo;
        let storedInfo = localStorage.getItem('genInfo');
        storedInfo = storedInfo ? JSON.parse(storedInfo) : null;
        //console.log(storedInfo)
        if(storedInfo){
            if(!loggedIn) confirmLoggedIn();
            dispatchedGenInfo(storedInfo);
            resolve("dispatched")
        }else{
            resolve("not dispatched");
        }
    });
}

export const updateOnlineStatus = status => {
    return {
        type: UPDATE_ONLINE_STATUS,
        payload: status
    }
}