import {
  FETCH_ONLINE_USERS_FULFILLED,
  SET_USER_TO_CHAT,
  FETCH_MESSAGES_FULFILLED,
  MESSAGE_RECIEVED_DISPATCHED,
  MESSAGE_SENT_DISPATCHED,
  FETCH_MESSAGES_PENDING,
  FETCH_MESSAGES_ERROR
} from '../types';
import axios from 'axios';
const chatServerUrl = process.env.CHAT_SERVER;

export const fetchedUsersOnline = users => {
  return {
    type: FETCH_ONLINE_USERS_FULFILLED,
    payload: users
  }
}
export const setUserToChat = userId => {
  return {
    type: SET_USER_TO_CHAT,
    payload: userId
  }
}
export const dispatchSentMessage = message => {
  return {
    type: MESSAGE_SENT_DISPATCHED,
    payload: message
  }
}
export const dispatchRecievedMessage = message => {
  return {
    type: MESSAGE_RECIEVED_DISPATCHED,
    payload: message
  }
}
export const fetchMessagesFulfilled = messages => {
  return {
    type: FETCH_MESSAGES_FULFILLED,
    payload: messages
  }
}
export const fetchMessagesPending = () => {
  return {
    type: FETCH_MESSAGES_PENDING
  }
}
export const fetchMessagesError = error => {
  return {
    type: FETCH_MESSAGES_ERROR,
    payload: error
  }
}
export const fetchChatMessages = (uid, inappToken) => {
  return dispatch => {
    dispatch(fetchMessagesPending());
    const genInfo = JSON.parse(localStorage.getItem('genInfo'));
    const { chatkitUser: { token } } = genInfo;
    const userToken = inappToken || token
    const url = chatServerUrl + '/api/v1/fetchChats?sender=' + uid + "&token=" + userToken;
    axios.get(url).then( results => {
      const { data } = results;
      let messages = {};
      let otherUsers = {};
      // get uids of other users this user has chatted with
      data.map(msgObj => {
        const { sender, recipient } = msgObj;
        if (sender !== uid) otherUsers[sender] = sender;
        else if (recipient !== uid) otherUsers[recipient] = recipient;
      });
      // if any user, seperate the different groups of messages
      if (Object.keys(otherUsers).length > 0) {
        Object.keys(otherUsers).map( otherUser => {
          const thisUsersMessages = [];
          data.map(msgObj => {
            const { sender, recipient } = msgObj;
            if (otherUser === sender || otherUser === recipient) thisUsersMessages.push(msgObj);
          });
          if (thisUsersMessages.length > 0) messages[otherUser] = thisUsersMessages;
        });
        dispatch(fetchMessagesFulfilled(messages))
      }
    }).catch(e => {
      dispatch(fetchMessagesError(e));
    });
  };
}