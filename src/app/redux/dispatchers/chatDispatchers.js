import {
  FETCH_ONLINE_USERS_PENDING,
  FETCH_ONLINE_USERS_FULFILLED,
  FETCH_ONLINE_USERS_ERROR,
  FETCH_MESSAGES_PENDING,
  FETCH_MESSAGES_FULFILLED,
  FETCH_MESSAGES_ERROR
} from '../types';

export const fetchedUsersOnline = users => {
  return {
    type: FETCH_ONLINE_USERS_FULFILLED,
    payload: users
  }
}