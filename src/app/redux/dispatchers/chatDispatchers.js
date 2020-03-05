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
export const fetchChatMessages = uid => {
  return dispatch => {
    dispatch(fetchMessagesPending());
    const url = chatServerUrl + 'api/v1/fetchChats?sender=' + uid;
    axios.get(url).then( results => {
      const { data } = results;
      let messages = {};
      let otherUser;
      data.map(msgObj => {
        const { sender, recipient } = msgObj;
        if (sender !== uid) otherUser = sender;
        else if (recipient !== uid) otherUser = recipient;
      });
      if (otherUser) {
        messages[otherUser] = data;
        console.log(messages);
        dispatch(fetchMessagesFulfilled(messages))
      }
    }).catch(e => {
      dispatch(fetchMessagesError(e));
    });
  };
}