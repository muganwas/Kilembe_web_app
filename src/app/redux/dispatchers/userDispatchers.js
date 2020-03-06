import { 
    FETCH_USERS_PENDING, 
    FETCH_USERS_FULFILLED, 
    FETCH_USERS_ERROR,
    FETCH_FRIENDS_PENDING, 
    FETCH_FRIENDS_FULFILLED, 
    FETCH_FRIENDS_ERROR,
    FETCH_IN_COMING_REQUEST_ERROR,
    FETCH_IN_COMING_REQUEST_FULFILLED,
    FETCH_IN_COMING_REQUEST_PENDING,
    FETCH_OUT_GOING_REQUEST_ERROR,
    FETCH_OUT_GOING_REQUEST_FULFILLED,
    FETCH_OUT_GOING_REQUEST_PENDING,
    SELECT_USER_ERROR,
    SELECT_USER_FULFILLED,
    RESPONSE_CLASS_CHANGED,
    FETCH_USER_DB_INFO_PENDING,
    FETCH_USER_DB_INFO_FULFILLED,
    FETCH_USER_DB_INFO_ERROR
} from '../types';
import Rebase from 're-base';
import app from '../../base';

const base = Rebase.createClass(app.database());
const usersRef = app.database().ref('users');

export const fetchingUsers = () => { 
    return {
        type: FETCH_USERS_PENDING
    }
}

export const usersSuccessfullyFetched = payload => { 
    return {
        type: FETCH_USERS_FULFILLED,
        payload
    }
}

export const fetchingUsersError = () => { 
    return {
        type: FETCH_USERS_ERROR
    }
}

export const fetchingFriends = () => { 
    return {
        type: FETCH_FRIENDS_PENDING
    }
}

export const friendsSuccessfullyFetched = payload => { 
    return {
        type: FETCH_FRIENDS_FULFILLED,
        payload
    }
}

export const fetchingFriendsError = () => { 
    return {
        type: FETCH_FRIENDS_ERROR
    }
}

export const fetchIncomingRequestsPending = () => {
    return {
        type: FETCH_IN_COMING_REQUEST_PENDING
    }
}

export const fetchIncomingRequestsFulfilled = payload => {
    return {
        type: FETCH_IN_COMING_REQUEST_FULFILLED,
        payload
    }
}

export const fetchIncomingRequestsError = () => {
    return {
        type: FETCH_IN_COMING_REQUEST_ERROR
    }
}
export const fetchOutGoingRequestsPending = () => {
    return {
        type: FETCH_OUT_GOING_REQUEST_PENDING
    }
}

export const fetchOutGoingRequestsFulfilled = payload => {
    return {
        type: FETCH_OUT_GOING_REQUEST_FULFILLED,
        payload
    }
}

export const fetchOutGoingRequestsError = () => {
    return {
        type: FETCH_OUT_GOING_REQUEST_ERROR
    }
}

export const selectUserFulfilled = payload => {
    return {
        type: SELECT_USER_FULFILLED,
        payload
    }
}

export const selectUserError = () => {
    return {
        type: SELECT_USER_ERROR
    }
}

export const responseClassChanged = payload => {
    return {
        type: RESPONSE_CLASS_CHANGED,
        payload
    }
}

export const fetchingUserInfoPending = () => {
    return {
        type:FETCH_USER_DB_INFO_PENDING
    }
}

export const fetchingUserInfoFulfilled = payload => {
    return {
        type:FETCH_USER_DB_INFO_FULFILLED,
        payload
    }
}

export const fetchingUserInfoError = payload => {
    return {
        type:FETCH_USER_DB_INFO_ERROR,
        payload
    }
}

export const fetchUsers = () => {
    return dispatch => {
        base.fetch(`users`, {
            context: this,
            asArray: true
        }).then(data => {
            let length = data.length;
            if(length!==0 && length!==null) dispatch(usersSuccessfullyFetched(data));
        }, error => {
            dispatch(fetchingUsersError(error));
        });
    }
}

export const fetchUserInfoFromDB = uid => {
    return dispatch => {
        fetchingUserInfoPending();
        base.fetch(`users/${uid}`, {
            context: this,
            asArray: false
        }).then(data => {
            let length = data.length;
            if(length !==0 && length !== null) dispatch(fetchingUserInfoFulfilled(data));
        }, error => {
            dispatch(fetchingUserInfoError(error));
        });
    }
}

export const fetchFriends = info => {
    return dispatch => {
        let { uid } = info;
        let friends = [];
        let friendsFull = {};
        let ref = usersRef.child(`${ uid }/friends`);
        ref.once('value').then(snapshot => {
            let uFriends = friendsFull = snapshot.val();
            if (uFriends !== null && uFriends !== undefined) {
                Object.keys(uFriends).map(value => {
                    //console.log(value)
                    friends.push(value);
                });
            }
            dispatch(friendsSuccessfullyFetched({friends, friendsFull}));
        }, error=>{
            dispatch(fetchingFriendsError(error));
        })
    }
}

export const pushSelectedUser = (users, key) => {
    return dispatch => {
        const info = {
            currUserId: users[key].uid,
            currUsersFriends: users[key].friends,
            currUserDname: users[key].dname,
            currUserAvUrl: users[key].avatar,
            currUserEmail: users[key].shareEmailAddress === true?users[key].email:"Email Address is hidden",
            currUserAbout: users[key].about,
            currUserSharePref: users[key].shareEmailAddress
        };
        if (users && key) dispatch(selectUserFulfilled(info));
        else dispatch(selectUserError({message: "No data"}));
    }
}

export const changeResponseClass = responseClass => {
    return dispatch => {
        dispatch(responseClassChanged(responseClass));
    }
}

export const fetchFriendsRequests = info => {
    return dispatch => {
        let { uid } = info;
        let ref = usersRef.child(`${uid}/friends`);
        ref.once('value').then(snapshot => {
            let outGoingRequests = [];
            let inComingRequests = [];
            snapshot.forEach((pFriend)=>{
                if (pFriend.val().direction === "outgoing" && pFriend.val().accepted === false) outGoingRequests.push(pFriend.key);
                else if (pFriend.val().direction === "incoming" && pFriend.val().accepted === false) inComingRequests.push(pFriend.key);
            });
            dispatch(fetchIncomingRequestsFulfilled(inComingRequests));
            dispatch(fetchOutGoingRequestsFulfilled(outGoingRequests));
        }, error=>{
            dispatch(fetchIncomingRequestsError(error));
            dispatch(fetchOutGoingRequestsError(error));
        });
    }
}