import {
  FETCH_ONLINE_USERS_FULFILLED,
  SET_USER_TO_CHAT,
  MESSAGE_RECIEVED_DISPATCHED,
  MESSAGE_SENT_DISPATCHED
} from '../types';

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