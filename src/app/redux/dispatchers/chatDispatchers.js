import {
  FETCH_ONLINE_USERS_FULFILLED,
  SET_USER_TO_CHAT
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